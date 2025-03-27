import { Server } from "socket.io";
import { readyHandler } from "./readyHandler";
import {
  ClientDraftStateProps,
  draftState,
  HandlerVarsProps,
} from "./draftState";
import { banPhase1Handler } from "./banPhase1Handler";
import EventEmitter from "events";
import { pickPhase1Handler } from "./pickPhase1Handler";
import { banPhase2Handler } from "./banPhase2Handler";
import { pickPhase2Handler } from "./pickPhase2Handler";
import { updateClientState } from "./clientDraftState";
import { endDraftHandler } from "./endDraftHandler";
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
        socket.emit("error", { draftNotInitialized: false });
        return null;
      }
      return draftState[lobbyCode];
    };

    currentConnections++;
    console.log("Connected. Current connections: ", currentConnections);

    socket.on("joinDraft", async ({ lobbyCode, sideCode }) => {
      try {
        const state = getDraftState(lobbyCode);

        // Redundant but I don't trust myself
        if (!state) {
          socket.emit("error", { invalidDraftID: true });
          return;
        }
        const redCode = state.redUser;
        const blueCode = state.blueUser;

        // Initialize EventEmitter for this lobby if not already
        if (!lobbyEmitters.has(lobbyCode)) {
          lobbyEmitters.set(lobbyCode, new EventEmitter());
        }

        // Join room
        socket.join(lobbyCode);

        let sideDisplay: string | null =
          sideCode === blueCode
            ? "blue"
            : sideCode === redCode
            ? "red"
            : "spectator";

        socket.emit("joinedDraft", {
          success: true,
          sideCode,
          lobbyCode,
          sideDisplay,
        });

        socket.emit("state", updateClientState(lobbyCode));
      } catch (error) {
        console.error("Error during role assignment:", error);
        socket.emit("error", { message: "Internal server error." });
        socket.disconnect();
      }
    });

    socket.on("ready", async ({ lobbyCode, sideCode, ready }) => {
      const state = getDraftState(lobbyCode);
      // Redundant but I don't trust myself
      if (!state) {
        socket.emit("error", { invalidDraftID: true });
        return;
      }

      const isDraftReady = readyHandler(state, sideCode, ready, lobbyCode, io);

      if (isDraftReady) {
        state.draftStarted = true;
        state.currentHover = null;
        state.activePhase = "banPhase1";
        io.to(lobbyCode).emit("startBanPhase1", updateClientState(lobbyCode));

        const emitter = lobbyEmitters.get(lobbyCode);
        if (!emitter) {
          console.error(`No EventEmitter found for lobby ${lobbyCode}`);
          return;
        }

        const handlerVars: HandlerVarsProps = {
          io: io,
          lobbyCode: lobbyCode,
          state: state,
          emitter: emitter,
        };

        const isBanPhase1Done = await banPhase1Handler(handlerVars);
        if (isBanPhase1Done) {
          state.currentHover = null;
          state.activePhase = "pickPhase1";

          const isPickPhase1Done = await pickPhase1Handler(handlerVars);

          if (isPickPhase1Done) {
            state.currentHover = null;
            state.activePhase = "banPhase2";
            io.to(lobbyCode).emit(
              "startBanPhase2",
              updateClientState(lobbyCode)
            );

            const isBanPhase2Done = await banPhase2Handler(handlerVars);

            if (isBanPhase2Done) {
              state.currentHover = null;
              state.activePhase = "pickPhase2";

              const isPickPhase2Done = await pickPhase2Handler(handlerVars);

              if (isPickPhase2Done) {
                await endDraftHandler(handlerVars);
                io.in(lobbyCode).disconnectSockets();
              }
            }
          }
        }
      }
    });

    socket.on("clientHover", ({ lobbyCode, sideCode, chosenChamp }) => {
      const state = getDraftState(lobbyCode);

      if (!state) {
        socket.emit("error", { invalidDraftID: true });
        return;
      }

      if (state.activePhase && state.activePhase !== "finished") {
        if (state.currentTurn === sideCode) {
          if (state.phaseType === "ban") {
            state.currentHover = chosenChamp;

            sideCode === state.blueUser
              ? state.bluePick = chosenChamp
              : state.redPick = chosenChamp;
              
            io.to(lobbyCode).emit("banHover", state);
          } else if (state.phaseType === "pick") {
            state.currentHover = chosenChamp;

            sideCode === state.blueUser
              ? state.bluePick = chosenChamp
              : state.redPick = chosenChamp;

            io.to(lobbyCode).emit("pickHover", state);
          }
        }
      }
    });
    socket.on("ban", ({ lobbyCode, sideCode, chosenChamp }) => {
      const state = getDraftState(lobbyCode);
      // Redundant but I don't trust myself
      if (!state) {
        socket.emit("error", { invalidDraftID: true });
        return;
      }

      if (
        state.activePhase !== "banPhase1" &&
        state.activePhase !== "banPhase2"
      ) {
        console.error("We are not in ban phase");
        return;
      }

      if (
        state.blueBans.includes(chosenChamp) ||
        state.redBans.includes(chosenChamp) ||
        state.bluePicks.includes(chosenChamp) ||
        state.redPicks.includes(chosenChamp)
      ) {
        console.error("Same champion already picked!");
        return;
      }

      if (sideCode === state.blueUser && sideCode === state.currentTurn) {
        state.bluePick = chosenChamp;
        lobbyEmitters.get(lobbyCode)!.emit("bluePick", chosenChamp);
        state.bluePick = null;
        state.currentHover = null;
      } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
        state.redPick = chosenChamp;
        lobbyEmitters.get(lobbyCode)!.emit("redPick", chosenChamp);
        state.redPick = null;
        state.currentHover = null;
      }
    });

    socket.on("pick", ({ lobbyCode, sideCode, chosenChamp }) => {
      const state = getDraftState(lobbyCode);

      // Redundant but I don't trust myself
      if (!state) {
        socket.emit("error", { invalidDraftID: true });
        return;
      }

      if (
        state.activePhase !== "pickPhase1" &&
        state.activePhase !== "pickPhase2"
      ) {
        console.error("We are not in pick phase");
        return;
      }

      if (
        state.blueBans.includes(chosenChamp) ||
        state.redBans.includes(chosenChamp) ||
        state.bluePicks.includes(chosenChamp) ||
        state.redPicks.includes(chosenChamp)
      ) {
        console.error("Same champion already picked!");
        return;
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
      console.log("Disconnected. Current Users: ", currentConnections);
    });
  });
};
