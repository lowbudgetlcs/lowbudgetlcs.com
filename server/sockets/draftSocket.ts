import { Server } from "socket.io";
import { getLobbyCodes } from "../db/queries/select";
import { DraftProps } from "../routes/draftRoutes";
import { readyHandler } from "./readyHandler";
import { draftState, initializeDraftState } from "./serverDraftHandler";
import { banPhase1Handler } from "./banPhase1Handler";
export interface DraftUsersProps {
  blue: string;
  red: string;
}
interface LobbyCodeProps {
  lobbyCode: string;
  redCode: string;
  blueCode: string;
}

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

        // Join room
        socket.join(lobbyCode);
        console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

        if (sideCode !== blueCode && sideCode !== redCode) {
          // Assign the user spectator if not using correct code
          socket.emit("Spectator", { spectator: true });
          return;
        }

        socket.emit("joinedDraft", { success: true, sideCode });
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

        try {
          const isBanPhase1Done = await banPhase1Handler(
            io,
            socket,
            lobbyCode,
            state
          );

          if (isBanPhase1Done) {
            console.log("OK WE GO OFF YEEEAEAA");
          }
        } catch (err) {
          console.error("Error in banPhase1Handler:", err);
        }
      }
    });
    socket.on("disconnect", () => {
      currentConnections--;
      console.log("User disconnected. Current Users: ", currentConnections);
    });
  });
};
