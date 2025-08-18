import EventEmitter from "events";
import { DraftStateProps } from "../../states/draftState";
import { Socket } from "socket.io";

interface pickHandlerProps {
  lobbyCode: string;
  sideCode: string;
  chosenChamp: string;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  lobbyEmitters: Map<string, EventEmitter>;
  socket: Socket;
}

const pickHandler = ({
  lobbyCode,
  sideCode,
  chosenChamp,
  getDraftState,
  lobbyEmitters,
  socket,
}: pickHandlerProps) => {
  const state = getDraftState(lobbyCode);

  // Redundant but I don't trust myself
  if (!state) {
    socket.emit("error", { invalidDraftID: true });
    return;
  }

  if (state.activePhase !== "pickPhase1" && state.activePhase !== "pickPhase2") {
    console.error("We are not in pick phase");
    return;
  }

  if (
    (state.blueBans.includes(chosenChamp) ||
      state.redBans.includes(chosenChamp) ||
      state.bluePicks.includes(chosenChamp) ||
      state.redPicks.includes(chosenChamp)) &&
    chosenChamp !== "nothing"
  ) {
    console.error("Same champion already picked!");
    return;
  }

  if (sideCode === state.blueUser && sideCode === state.currentTurn) {
    state.bluePick = chosenChamp;
    lobbyEmitters.get(lobbyCode)?.emit("bluePick", chosenChamp);
    state.bluePick = null;
  } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
    state.redPick = chosenChamp;
    lobbyEmitters.get(lobbyCode)?.emit("redPick", chosenChamp);
    state.redPick = null;
  }
};
export default pickHandler;
