import { Server } from "socket.io";
import { getLobbyCodes } from "../db/queries/select";
import { DraftProps } from "../routes/draftRoutes";
import { readyHandler } from "./readyHandler";
import { draftState, initializeDraftState } from "./serverDraftHandler";

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
  let blueJoined = false;
  let redJoined = false;
  io.on("connection", (socket) => {
    currentConnections++;
    console.log("User connected. current connections: ", currentConnections);

    socket.on(
      "joinDraft",
      async ({
        lobbyCode,
        sideCode,
      }: {
        lobbyCode: string;
        sideCode: string;
      }) => {
        console.log("Server received lobbyCode:", lobbyCode);
        console.log("Server received sideCode:", sideCode);

        try {
          const codeQuery = await getLobbyCodes(lobbyCode);
          if (!codeQuery) {
            socket.emit("error", { message: "Invalid Draft ID" });
            socket.disconnect();
            return;
          }

          const lobbyCodes: LobbyCodeProps = codeQuery;
          console.log("Valid LOBBY CODES: ", lobbyCodes);

          const draftUsers: DraftUsersProps = {
            blue: lobbyCodes.blueCode,
            red: lobbyCodes.redCode,
          };

          // Initialize Draft
          await initializeDraftState(
            lobbyCode,
            draftUsers.blue,
            draftUsers.red
          );
          // update the draft state with blue and red url codes
          const state = draftState[lobbyCode];
          state.blueUser = lobbyCodes.blueCode;
          state.redUser = lobbyCodes.redCode;

          // Join room
          socket.join(lobbyCode);
          console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

          if (sideCode === lobbyCodes.blueCode) {
            blueJoined = true;
          } else if (sideCode === lobbyCodes.redCode) {
            blueJoined = true;
          } else {
            // Assign the user spectator if not using correct code
            socket.emit("Spectator", { spectator: true });
            console.log("Connected user is a spectator.");
            return;
          }

          if (blueJoined && redJoined) {
            state.draftStarted = true;
          }
          
          await readyHandler(draftUsers, socket, lobbyCode, io);
        } catch (error) {
          console.error("Error during role assignment:", error);
          socket.emit("error", { message: "Internal server error." });
          socket.disconnect();
        }
      }
    );

    socket.on("disconnect", () => {
      currentConnections--;
      console.log("User disconnected. Current Users: ", currentConnections);
    });
  });
};
