import { Server } from "socket.io";
import { getLobbyCodes } from "../db/queries/select";
import { DraftProps } from "../routes/draftRoutes";
import { draftHandler } from "./draftHandler";

export interface DraftUsers {
  blue: string | null;
  red: string | null;
}
interface LobbyCodeProps {
  lobbyCode: string;
  redCode: string;
  blueCode: string;
}


let currentConnections: number = 0;
export const draftSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    currentConnections++;

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

          // Validate role
          if (
            lobbyCodes.redCode != sideCode &&
            lobbyCodes.blueCode != sideCode
          ) {
            socket.emit("error", { message: "Role not found or invalid." });
            socket.disconnect();
            return;
          }
          //! Rest of code will not run if side or lobbyCode invalid

          // Check and assign role
          const draft = {
            blue: "",
            red: "",
          };
          if (sideCode === lobbyCodes.blueCode) {
            draft.blue = sideCode;
          } else if (sideCode === lobbyCodes.redCode) {
            draft.red = sideCode;
          } else {
            socket.emit("Spectator", { message: "spectator" });
          }

          // Join room
          socket.join(lobbyCode);
          console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

          // Notify the client and others
          socket.emit("joinedDraft", { lobbyCode, sideCode });
          io.to(lobbyCode).emit("userJoined", { sideCode, id: socket.id });

          // Handle draft-specific logic
          draftHandler(draft, socket, lobbyCode);
        } catch (error) {
          console.error("Error during role assignment:", error);
          socket.emit("error", { message: "Internal server error." });
          socket.disconnect();
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      currentConnections--;
    });
  });
};


