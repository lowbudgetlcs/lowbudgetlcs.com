import { insertDraft, insertFinishedDraft } from "../db/queries/insert";
import { fearlessState } from "../draftTool/initializers/fearlessLobbyInitializer";
import { updateClientState } from "./clientDraftState";
import { HandlerVarsProps } from "./draftState";

export const endDraftHandler = async ({
  io,
  lobbyCode,
  state,
}: HandlerVarsProps) => {
  state.activePhase = "finished";
  state.phaseType = null;
  state.displayTurn = null;
  state.timer = 0;
  state.draftComplete = true;
  io.to(lobbyCode).emit("draftComplete", updateClientState(lobbyCode));
  if (state.fearlessCode) {
    const fearlessCode = state.fearlessCode;
    const fearlessData = fearlessState[fearlessCode];

    if (fearlessData) {
      io.to(fearlessCode).emit("draftCompleted", {
        fearlessCode,
        lobbyCode: lobbyCode,
      });
    }
  }
  await insertFinishedDraft(state, lobbyCode);
};
