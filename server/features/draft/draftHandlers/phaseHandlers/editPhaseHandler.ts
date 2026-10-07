import { updateClientState } from "../../models/clientDraftState";
import { HandlerVarsProps } from "../../models/draftState";

const editPhaseHandler = async ({ io, lobbyCode, state, emitter }: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "editPhase") {
    return false;
  }

  return new Promise((resolve) => {
    state.phaseType = "edit";
    state.currentTurn = "";
    state.displayTurn = null;
    state.currentHover = null;
    state.bluePick = null;
    state.redPick = null;
    state.blueFinalizeReady = false;
    state.redFinalizeReady = false;
    state.timer = 124;
    io.to(lobbyCode).emit("editPhase", updateClientState(lobbyCode));

    let finished = false;
    const finishPhase = () => {
      if (finished) {
        return;
      }

      finished = true;
      clearInterval(interval);
      emitter.off("finalizeDraft", setFinalizeReady);
      resolve(true);
    };

    const setFinalizeReady = (sideCode: string, ready: boolean) => {
      if (sideCode === state.blueUser) {
        state.blueFinalizeReady = ready;
      } else if (sideCode === state.redUser) {
        state.redFinalizeReady = ready;
      } else {
        return;
      }

      io.to(lobbyCode).emit("finalizeReady", updateClientState(lobbyCode));
      if (state.blueFinalizeReady && state.redFinalizeReady) {
        finishPhase();
      }
    };

    const interval = setInterval(() => {
      state.timer--;
      io.to(lobbyCode).emit("timer", state.timer);
      if (state.timer <= 0) {
        finishPhase();
      }
    }, 1000);

    emitter.on("finalizeDraft", setFinalizeReady);
  });
};

export default editPhaseHandler;