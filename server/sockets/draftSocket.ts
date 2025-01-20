import { Server } from "socket.io";
import { getLobbyCodes } from "../db/queries/select";
import { DraftProps } from "../routes/draftRoutes";
import { readyHandler } from "./readyHandler";
import { draftState, initializeDraftState } from "./serverDraftHandler";
import { banPhase1Handler } from "./banPhase1Handler";
import EventEmitter from "events";
import { pickPhase1Handler } from "./pickPhase1Handler";
import { banPhase2Handler } from "./banPhase2Handler";
import { pickPhase2Handler } from "./pickPhase2Handler";
export interface DraftUsersProps {
  blue: string;
  red: string;
}

const lobbyEmitters: Map<string, EventEmitter> = new Map();
let currentConnections: number = 0;
export const draftSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const getDraftState = (lobbyCode: string) => {
      if (!draftState[lobbyCode]) {
        console.error(`State for lobby ${lobbyCode} is not initialized`);
        return null;
      }
      return draftState[lobbyCode];
    };

    currentConnections++;
    console.log("User connected. current connections: ", currentConnections);

    socket.on("joinDraft", async ({ lobbyCode, sideCode }) => {
      try {
        const codeQuery = await getLobbyCodes(lobbyCode);

        if (!codeQuery) throw new Error("Invalid Draft ID");

        const { blueCode, redCode } = codeQuery;
        console.log(`The Valid lobby codes are ${blueCode} and ${redCode}`);

        // Initialize Draft
        console.log("initializing draft state");
        initializeDraftState(lobbyCode, blueCode, redCode);

        // Initialize EventEmitter for this lobby if not already
        if (!lobbyEmitters.has(lobbyCode)) {
          lobbyEmitters.set(lobbyCode, new EventEmitter());
        }

        // Join room
        socket.join(lobbyCode);
        console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

        if (sideCode !== blueCode && sideCode !== redCode) {
          // Assign the user spectator if not using correct code
          socket.emit("Spectator", { spectator: true });
          return;
        }

        socket.emit("joinedDraft", { success: true, sideCode, lobbyCode });
      } catch (error) {
        console.error("Error during role assignment:", error);
        socket.emit("error", { message: "Internal server error." });
        socket.disconnect();
      }
    });

    socket.on("ready", async ({ lobbyCode, sideCode, ready }) => {
      console.log("ready received");
      const state = getDraftState(lobbyCode);
      if (!state) return;

      const isDraftReady = readyHandler(state, sideCode, ready, lobbyCode, io);

      if (isDraftReady) {
        console.log("Draft is ready in ready socket");
        state.draftStarted = true;
        state.activePhase = "banPhase1";
        io.to(lobbyCode).emit("startBanPhase1", { lobbyCode });

        const emitter = lobbyEmitters.get(lobbyCode);
        if (!emitter) {
          console.error(`No EventEmitter found for lobby ${lobbyCode}`);
          return;
        }

        const isBanPhase1Done = await banPhase1Handler(
          io,
          socket,
          lobbyCode,
          state,
          emitter
        );
        if (isBanPhase1Done) {
          state.activePhase = "pickPhase1";
          console.log("isBanPhase1Done is true!");

          const isPickPhase1Done = await pickPhase1Handler(
            io,
            socket,
            lobbyCode,
            state,
            emitter
          );

          if (isPickPhase1Done) {
            state.activePhase = "banPhase2";
            io.to(lobbyCode).emit("startBanPhase2", { lobbyCode });

            const isBanPhase2Done = await banPhase2Handler(
              io,
              socket,
              lobbyCode,
              state,
              emitter
            );

            if (isBanPhase2Done) {
              state.activePhase = "pickPhase2";
              console.log("isBanPhase2Done is true!");
    
              const isPickPhase2Done = await pickPhase2Handler(
                io,
                socket,
                lobbyCode,
                state,
                emitter
              );

              if (isPickPhase2Done) {
                state.activePhase = null
                console.log("Draft Complete!")
                io.to(lobbyCode).emit('draftComplete')
                io.in(lobbyCode).disconnectSockets()
              }
            }
          }
        }
      }
    });

    socket.on("ban", ({ lobbyCode, sideCode, chosenChamp }) => {
      const state = getDraftState(lobbyCode);
      if (!state) return;

      if (
        state.activePhase !== "banPhase1" &&
        state.activePhase !== "banPhase2"
      ) {
        console.error("We are not in ban phase");
        return;
      }

      if (state.bansArray.includes(chosenChamp) || state.picksArray.includes(chosenChamp)) {
        return
      }

      if (sideCode === state.blueUser && sideCode === state.currentTurn) {
        state.bluePick = chosenChamp;
        lobbyEmitters.get(lobbyCode)?.emit("bluePick", chosenChamp);
        state.bluePick = null;
      } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
        state.redPick = chosenChamp;
        lobbyEmitters.get(lobbyCode)?.emit("redPick", chosenChamp);
        state.redPick = null;
      }
    });

    socket.on("pick", ({ lobbyCode, sideCode, chosenChamp }) => {
      const state = getDraftState(lobbyCode);
      if (!state) return;

      if (
        state.activePhase !== "pickPhase1" &&
        state.activePhase !== "pickPhase2"
      ) {
        console.error("We are not in pick phase");
        return;
      }

      if (state.picksArray.includes(chosenChamp) || state.bansArray.includes(chosenChamp)) {
        return
      }

      if (sideCode === state.blueUser && sideCode === state.currentTurn) {
        state.bluePick = chosenChamp;
        lobbyEmitters.get(lobbyCode)?.emit("bluePick", chosenChamp);
        state.bluePick = null;
      } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
        state.redPick = chosenChamp;
        lobbyEmitters.get(lobbyCode)?.emit("redPick", chosenChamp);
        state.redPick = null;
      }
    });

    socket.on("disconnect", () => {
      currentConnections--;
      console.log("User disconnected. Current Users: ", currentConnections);
    });
  });
};
