import { Namespace } from "socket.io";
import { draftState } from "../states/draftState";
import EventEmitter from "events";
import banHandler from "../draftHandlers/pickBanHandlers/banHandler";
import pickHandler from "../draftHandlers/pickBanHandlers/pickHandler";
import clientHoverHandler from "../draftHandlers/pickBanHandlers/clientHoverHandler";
import readySocketHandler from "../draftHandlers/startHandlers/readyHandler";
import joinDraftHandler from "../draftHandlers/startHandlers/joinDraftHandler";
import fixPickHandler from "../draftHandlers/pickBanHandlers/fixPickHandler";
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
      })
    );

    // Ban phase listener
    socket.on("ban", ({ lobbyCode, sideCode, chosenChamp }) =>
      banHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket })
    );

    // Pick Phase listener
    socket.on("pick", ({ lobbyCode, sideCode, chosenChamp }) =>
      pickHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket })
    );

    // Fix Phase listener
    socket.on("fixPick", ({ lobbyCode, sideCode, chosenChamp }) =>
      fixPickHandler({ lobbyCode, sideCode, chosenChamp, getDraftState, lobbyEmitters, socket })
    );

    // Listens for disconnections for logging
    socket.on("disconnect", () => {
      console.log("Draft Connections (left): ", io.sockets.size);
    });
  });
};
