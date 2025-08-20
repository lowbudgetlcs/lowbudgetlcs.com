import { updateClientState } from "../../states/clientDraftState";
import { HandlerVarsProps } from "../../states/draftState";

const fixPhaseHandler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "fix") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const startFixPhase = async () => {
      io.to(lobbyCode).emit("fixPhase", updateClientState(lobbyCode));
      state.phaseType = "pick";
      try {
        if (state.blueFixPick) {
          io.to(lobbyCode).emit("askRedToAcceptPick", updateClientState(lobbyCode));
        } else if (state.redFixPick) {
          io.to(lobbyCode).emit("askBlueToAcceptPick", updateClientState(lobbyCode));
        }
      } catch (err) {
        console.error("Error during turn:", err);
        reject(err);
        return;
      }
    };
  });
};

export default fixPhaseHandler;
