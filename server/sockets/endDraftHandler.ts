import { insertDraft, insertFinishedDraft } from "../db/queries/insert";
import { updateClientState } from "./clientDraftState";
import { HandlerVarsProps } from "./draftState";

export const endDraftHandler = async ({
  io,
  lobbyCode,
  state,
}: HandlerVarsProps) => {
  state.activePhase = "finished";
  console.log("Draft Complete!");
  state.phaseType = null;
  state.displayTurn = null;
  state.timer = 0;
  state.draftComplete = true;
  io.to(lobbyCode).emit("draftComplete", updateClientState(lobbyCode));

  if (state.tournamentID) {
    await insertFinishedDraft(state);
  }
};
