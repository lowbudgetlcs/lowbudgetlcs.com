import { Socket } from "socket.io";
import { DraftUsers } from "./draftSocket";

export const draftHandler = (
  draft: DraftUsers,
  socket: Socket,
  lobbyCode: string
) => {
  let blueReady = false;
  let redReady = false;
  let draftStart = false;
  let timer = 34;
  let shownTimer = timer - 4;

  const redUser = draft.red;
  const blueUser = draft.blue;
  let currentTurn: string;

  // Ready Up Draft
  socket.on("ready", ({ sideCode, ready }) => {
    if (sideCode === blueUser) {
      if (ready === true) {
        socket.to(lobbyCode).emit("blueReady", true);
        console.log("blue is ready");
        blueReady = true;
      } else if (ready === false) {
        socket.to(lobbyCode).emit("blueReady", false);
        console.log("blue is not ready");
        blueReady = false;
      }
    }
    if (sideCode === redUser) {
      if (ready === true) {
        socket.to(lobbyCode).emit("redReady", true);
        console.log("red is ready");
        redReady = true;
      } else if (ready === false) {
        socket.to(lobbyCode).emit("redReady", false);
        redReady = false;
      }
    }
    // Starts the draft if both players are ready
    if (blueReady && redReady) {
      draftStart = true;
      socket.to(lobbyCode).emit("startDraft", true);

    }
  });
};

const banPhase = () => {
    
}