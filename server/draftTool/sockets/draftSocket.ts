import { Namespace } from "socket.io";
import { draftState } from "../states/draftState";
import EventEmitter from "events";
import banHandler from "../draftHandlers/pickBanHandlers/banHandler";
import pickHandler from "../draftHandlers/pickBanHandlers/pickHandler";
import clientHoverHandler from "../draftHandlers/pickBanHandlers/clientHoverHandler";
import readySocketHandler from "../draftHandlers/startHandlers/readyHandler";
import joinDraftHandler from "../draftHandlers/startHandlers/joinDraftHandler";
export interface DraftUsersProps {
  blue: string;
  red: string;
}

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
      })
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
      })
    );

    // Pick, Ban, and Hover socket listeners
    // Listens to champion hovers (clicking on image card) from ANY client in the room
    socket.on("clientHover", ({ lobbyCode, sideCode, chosenChamp }) =>
      clientHoverHandler({
        lobbyCode,
        sideCode,
        chosenChamp,
        getDraftState,
        socket,
        io,
      })
    );

    // Listens for champion ban from ANY client in the room
    socket.on("ban", ({ lobbyCode, sideCode, chosenChamp }) =>
      banHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket })
    );

    // Listens for champion pick from ANY client in the room
    socket.on("pick", ({ lobbyCode, sideCode, chosenChamp }) =>
      pickHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket })
    );

    // Listens for disconnections for logging
    socket.on("disconnect", () => {
      console.log("Draft Connections (left): ", io.sockets.size);
    });
  });
};
