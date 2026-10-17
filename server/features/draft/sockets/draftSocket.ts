import { Namespace } from "socket.io";
import { draftState } from "../models/draftState";
import EventEmitter from "events";
import banHandler from "../draftHandlers/pickBanHandlers/banHandler";
import pickHandler from "../draftHandlers/pickBanHandlers/pickHandler";
import clientHoverHandler from "../draftHandlers/pickBanHandlers/clientHoverHandler";
import readySocketHandler from "../draftHandlers/startHandlers/readyHandler";
import joinDraftHandler from "../draftHandlers/startHandlers/joinDraftHandler";
import handleFixes from "../draftHandlers/fixHandlers/handleFixes";
import { updateClientState } from "../models/clientDraftState";
export interface DraftUsersProps {
  blue: string;
  red: string;
}

interface PendingSideSwapProps {
  requestingSide: "blue" | "red";
  respondingSideCode: string;
  timeout: NodeJS.Timeout;
}

const pendingSideSwaps = new Map<string, PendingSideSwapProps>();

const resolveSideSwap = (io: Namespace, lobbyCode: string, accepted: boolean) => {
  const pending = pendingSideSwaps.get(lobbyCode);
  if (!pending) return;

  pendingSideSwaps.delete(lobbyCode);
  clearTimeout(pending.timeout);

  const state = draftState[lobbyCode];
  const shouldSwap = accepted && !!state && !state.draftStarted && state.activePhase === null;
  if (shouldSwap && state) {
    [state.blueUser, state.redUser] = [state.redUser, state.blueUser];
    [state.blueDisplayName, state.redDisplayName] = [state.redDisplayName, state.blueDisplayName];
    state.blueReady = false;
    state.redReady = false;
    state.blueFinalizeReady = false;
    state.redFinalizeReady = false;
  }

  io.to(lobbyCode).emit("sideSwapResolved", {
    accepted: shouldSwap,
    requestingSide: pending.requestingSide,
    currentDraftState: state ? updateClientState(lobbyCode) : undefined,
  });
};

const lobbyEmitters: Map<string, EventEmitter> = new Map();
export const draftSocket = (io: Namespace) => {
  io.on("connection", (socket) => {
    const getDraftState = (lobbyCode: string) => {
      if (!draftState[lobbyCode]) {
        socket.emit("error", { draftNotInitialized: false });
        return null;
      }
      return draftState[lobbyCode];
    };

    console.log("Draft Connections (joined): ", io.sockets.size);

    // Handles initial connection to draft
    // Assigns sides and spectators
    socket.on("joinDraft", async ({ lobbyCode, sideCode }) =>
      joinDraftHandler({
        lobbyCode,
        sideCode,
        getDraftState,
        lobbyEmitters,
        socket,
      }),
    );

    // Ready socket listener
    //! Handles draft phases inside function
    socket.on("ready", async ({ lobbyCode, sideCode, ready }) =>
      readySocketHandler({
        lobbyCode,
        sideCode,
        ready,
        getDraftState,
        lobbyEmitters,
        socket,
        io,
      }),
    );

    socket.on("requestSideSwap", ({ lobbyCode, sideCode }) => {
      const state = draftState[lobbyCode];
      if (
        !state ||
        !socket.rooms.has(lobbyCode) ||
        socket.data.sideCode !== sideCode ||
        state.draftStarted ||
        state.activePhase !== null ||
        (sideCode !== state.blueUser && sideCode !== state.redUser) ||
        pendingSideSwaps.has(lobbyCode)
      ) {
        return;
      }

      const requestingSide = sideCode === state.blueUser ? "blue" : "red";
      const respondingSideCode = requestingSide === "blue" ? state.redUser : state.blueUser;
      const expiresAt = Date.now() + 30000;
      const timeout = setTimeout(() => resolveSideSwap(io, lobbyCode, false), 30000);
      pendingSideSwaps.set(lobbyCode, {
        requestingSide,
        respondingSideCode,
        timeout,
      });

      io.to(lobbyCode).emit("sideSwapRequested", {
        requestingSide,
        requestingDisplayName: requestingSide === "blue" ? state.blueDisplayName : state.redDisplayName,
        expiresAt,
      });
    });

    socket.on("respondToSideSwap", ({ lobbyCode, sideCode, accepted }) => {
      const pending = pendingSideSwaps.get(lobbyCode);
      if (
        !socket.rooms.has(lobbyCode) ||
        socket.data.sideCode !== sideCode ||
        !pending ||
        pending.respondingSideCode !== sideCode ||
        typeof accepted !== "boolean"
      ) {
        return;
      }

      resolveSideSwap(io, lobbyCode, accepted);
    });

    // Socket listeners for client input

    // Client Champion Hover listener
    // Used in pick and ban phases
    socket.on("clientHover", ({ lobbyCode, sideCode, chosenChamp }) =>
      clientHoverHandler({
        lobbyCode,
        sideCode,
        chosenChamp,
        getDraftState,
        socket,
        io,
      }),
    );

    // Ban phase listener
    socket.on("ban", ({ lobbyCode, sideCode, chosenChamp }) =>
      banHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket }),
    );

    // Pick Phase listener
    socket.on("pick", ({ lobbyCode, sideCode, chosenChamp }) =>
      pickHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket }),
    );

    socket.on("finalizeDraft", ({ lobbyCode, sideCode, ready }) => {
      const state = getDraftState(lobbyCode);
      if (!state || state.activePhase !== "editPhase") {
        return;
      }

      if ((sideCode !== state.blueUser && sideCode !== state.redUser) || typeof ready !== "boolean") {
        socket.emit("error", { invalidSideCode: true });
        return;
      }

      lobbyEmitters.get(lobbyCode)?.emit("finalizeDraft", sideCode, ready);
    });

    // Handles all fix requests and responses throughout the draft
    handleFixes(socket, io, (lobbyCode) => draftState[lobbyCode] ?? null);

    // Listens for disconnections for logging
    socket.on("disconnect", () => {
      console.log("Draft Connections (left): ", io.sockets.size);
    });
  });
};
