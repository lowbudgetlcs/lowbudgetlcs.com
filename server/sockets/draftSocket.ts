import { Server } from "socket.io";
import { getLobbyCodes } from "../db/queries/select";
import { DraftProps } from "../routes/draftRoutes";
import { readyHandler } from "./readyHandler";

export interface DraftUsers {
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

          //! Rest of code will not run if  lobbyCode invalid

          // Check and assign role
          const draft = {
            blue: "",
            red: "",
          };
          if (sideCode === lobbyCodes.blueCode) {
            draft.blue = sideCode;
            console.log("connected user is blue");
          } else if (sideCode === lobbyCodes.redCode) {
            draft.red = sideCode;
            console.log("Connected user is Red");
          } else {
            socket.emit("Spectator", { spectator: true });
          }

          // Join room
          socket.join(lobbyCode);
          console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

          // Notify the client and others upon joining
          // ! Will not need this on prod
          socket.emit("joinedDraft", { lobbyCode, sideCode });
          io.to(lobbyCode).emit("userJoined", { sideCode, id: socket.id });

          // Handle draft-specific logic
          readyHandler(draft, socket, lobbyCode);
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
