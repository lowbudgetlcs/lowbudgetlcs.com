import { insertDraft, insertFinishedDraft } from "../../../db/queries/insert";
import { fearlessState } from "../../initializers/fearlessLobbyInitializer";
import { fearlessEmitters } from "../../sockets/fearlessSocket";
import { updateClientState } from "../../states/clientDraftState";
import { HandlerVarsProps } from "../../states/draftState";

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

    // Tells fearless room draft is finished (if there is one)
    if (fearlessData) {
      if (fearlessEmitters.has(fearlessCode)) {
        fearlessEmitters.get(fearlessCode)!.emit("draftCompleted", {
          fearlessCode,
          lobbyCode,
        });
      } else {
        console.error(
          `No EventEmitter found for fearlessCode: ${fearlessCode}`
        );
      }
    }
  }

  await insertFinishedDraft(state, lobbyCode);
};
