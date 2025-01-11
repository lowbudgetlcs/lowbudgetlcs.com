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
  
  // Starts the draft if both players are ready
  const checkReady = () => {
    console.log("BlueReady: ", blueReady, " RedReady: ", redReady);
    if (draftStart) {
      console.log("draft started");
      return;
    }
    if (blueReady && redReady) {
      draftStart = true;
      console.log("starting draft in room: ");
      socket.to(lobbyCode).emit("startDraft", true);
      draftHandler(socket, lobbyCode, blueUser, redUser);
    }
  };

  // Ready Up Draft
  socket.on("ready", ({ sideCode, ready }) => {
    if (sideCode) {
      if (sideCode) {
        if (sideCode === blueUser && blueReady !== ready) {
          blueReady = ready; // Update the readiness state
          socket.to(lobbyCode).emit("blueReady", ready); // Inform other clients
          console.log("Blue:", ready);
          checkReady();
        }
        if (sideCode === redUser && redReady !== ready) {
          redReady = ready; // Update the readiness state
          socket.to(lobbyCode).emit("redReady", ready); // Inform other clients
          console.log("Red:", ready);
          checkReady();
        }
      }
    }
  });
};
