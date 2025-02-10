import { Server, Socket } from "socket.io";
import { DraftStateProps } from "./draftStateInitializer";

export const readyHandler = (
  state: DraftStateProps,
  sideCode: string,
  ready: boolean,
  lobbyCode: string,
  io: Server
) => {
  const { blueUser, redUser } = state;

  // Starts the draft if both players are ready
  console.log("BlueReady: ", state.blueReady, " RedReady: ", state.redReady);

  const isBlue = sideCode === blueUser;
  const isRed = sideCode === redUser;

  // Logic to ensure only blue and red are processed
  if (!isBlue && !isRed) {
    console.warn(`Invalid sideCode received: ${sideCode}`);
    return false;
  }
  const readyKey = isBlue ? "blueReady" : "redReady";

  if (state[readyKey] !== ready) {
    state[readyKey] = ready;
    const side = isBlue ? "blue" : "red";
    io.to(lobbyCode).emit(isBlue ? "blueReady" : "redReady", state);
    console.log(`${isBlue ? "Blue" : "Red"} ready status updated:`, ready);
  }

  // Check if both players are redied up
  if (state.blueReady && state.redReady && !state.draftStarted) {
    console.log("starting draft in room: ", lobbyCode);
    state.draftStarted = true;
    io.to(lobbyCode).emit("startDraft", true);
    return true;
  }

  return false;
};
