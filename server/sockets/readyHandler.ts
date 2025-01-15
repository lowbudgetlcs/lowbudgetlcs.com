import { Server, Socket } from "socket.io";
import { DraftUsersProps } from "./draftSocket";
import { draftHandler } from "./serverDraftHandler";
let blueReady = false;
let redReady = false;

export const readyHandler = (
  draft: DraftUsersProps,
  socket: Socket,
  lobbyCode: string,
  io: Server
) => {
  let draftStart = false;
  const redUser: string = draft.red;
  const blueUser: string = draft.blue;

  // Starts the draft if both players are ready
  const checkReady = () => {
    console.log("BlueReady: ", blueReady, " RedReady: ", redReady);

    if (blueReady && redReady && draftStart === false) {
      draftStart = true;
      console.log("starting draft in room: ", lobbyCode);
      socket.to(lobbyCode).emit("startDraft", true);
      draftHandler(io, socket, lobbyCode, blueUser, redUser);
    }
  };

  // Ready Up Draft
  socket.on("ready", ({ sideCode, ready }) => {
    console.log("SERVER: Received ready =>", sideCode, ready);
    console.log("RedReady in BLUEREADY Section: ", redReady);
    console.log("Blue ready in REDREADY Section: ", blueReady);

    if (!sideCode) return;

    if (sideCode === blueUser && blueReady !== ready) {
      blueReady = ready;
      socket.to(lobbyCode).emit("blueReady", ready); // Inform other clients
      console.log("Blue:", ready);
    }
    if (sideCode === redUser && redReady !== ready) {
      redReady = ready;
      socket.to(lobbyCode).emit("redReady", ready); // Inform other clients
      console.log("Red:", ready);
    }

    checkReady();
  });
};
