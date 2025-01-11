import { Socket } from "socket.io";
import { DraftUsersProps } from "./draftSocket";
import { draftHandler } from "./serverDraftHandler";

export const readyHandler = (
  draft: DraftUsersProps,
  socket: Socket,
  lobbyCode: string
) => {
  let blueReady = false;
  let redReady = false;
  let draftStart = false;
  const redUser: string = draft.red;
  const blueUser: string = draft.blue;
  // Ready Up Draft
  socket.on("ready", ({ sideCode, ready }) => {
    if (sideCode) {
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
          console.log("red is not ready");
          redReady = false;
        }
      }
    }

    // Starts the draft if both players are ready
    if (blueReady && redReady) {
      draftStart = true;
      console.log("starting draft in room: ");
      socket.to(lobbyCode).emit("startDraft", true);
      draftHandler(socket, lobbyCode, blueUser, redUser);
    }
  });
};
