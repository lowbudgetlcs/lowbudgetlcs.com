import fs from "fs";
import path from "path";
import { Server } from "socket.io";
const io = new Server(8070, {
  cors: {
    origin: "*",
  },
});
export interface DraftUsers {
  blue: string | null;
  red: string | null;
}

let currentConnections: number = 0;
export const draftSocket = () => {
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
            draft.blue = socket.id;
          } else if (sideCode === lobbyCodes.redCode) {
            draft.red = socket.id;
          } else if (sideCode === "spectator") {
            socket.emit("Spectator", { message: "spectator" });
          } else {
            socket.emit("error", { message: "Invalid role" });
            socket.disconnect();
            return;
          }

          // Join room
          socket.join(lobbyCode);
          console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

          // Notify the client and others
          socket.emit("joinedDraft", { lobbyCode, sideCode });
          io.to(lobbyCode).emit("userJoined", { sideCode, id: socket.id });

          // Handle draft-specific logic
          draftHandler(draft, io, lobbyCode);
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

export async function checkLiveDraftsForRole(teamCode: string) {
  try {
    const data = await fs.promises.readFile("../draft/draft.json", "utf-8");
    const draft: DraftProps = JSON.parse(data);
    console.log("File content:", data);

    // Check the role based on the team code
    if (teamCode === draft.lobbyCode) {
      return "spectator";
    } else if (teamCode === draft.blueCode) {
      return "blue";
    } else if (teamCode === draft.redCode) {
      return "red";
    } else {
      console.log("No match for codes");
      return undefined;
    }
  } catch (err) {
    console.error("Error reading file:", err);
    return undefined;
  }
}

export const draftHandler = (
  draft: DraftUsers,
  io: Server,
  lobbyCode: string
) => {
  let blueReady = false;
  let redReady = false;
  let timer = 34;
  let shownTimer = timer - 4;

  const redUser = draft.red;
  const blueUser = draft.blue;
  let currentTurn: string;

  // Ready Up Draft
  io.on("ready", ({ user, ready }) => {
    if (user === redUser) {
      if (ready === true) {
        io.to(lobbyCode).emit("redReady", true);
      } else if (ready === false) {
        io.to(lobbyCode).emit("redReady", false);
      }
    }
  });
};
