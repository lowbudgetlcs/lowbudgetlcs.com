import { Namespace } from "socket.io";
import { DraftStateProps } from "./draftState";
import { updateClientState } from "./clientDraftState";

export const readyHandler = (
  state: DraftStateProps,
  sideCode: string,
  ready: boolean,
  lobbyCode: string,
  io: Namespace
) => {
  const { blueUser, redUser } = state;

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
    io.to(lobbyCode).emit(
      isBlue ? "blueReady" : "redReady",
      updateClientState(lobbyCode)
    );
  }

  // Check if both players are redied up
  if (state.blueReady && state.redReady && !state.draftStarted) {
    state.draftStarted = true;
    io.to(lobbyCode).emit("startDraft", true);
    return true;
  }

  return false;
};
