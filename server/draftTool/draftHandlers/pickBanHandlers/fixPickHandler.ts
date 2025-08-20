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

const fixPickHandler = ({
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

  if (state.activePhase !== "fix") {
    console.error("We are not in fix phase in: ", lobbyCode);
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

  if (sideCode === state.blueUser) {
    state.blueFixPick = chosenChamp;
    lobbyEmitters.get(lobbyCode)?.emit("blueFixPick", chosenChamp);
    state.blueFixPick = undefined;
  } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
    state.redFixPick = chosenChamp;
    lobbyEmitters.get(lobbyCode)?.emit("redFixPick", chosenChamp);
    state.redFixPick = undefined;
  }
};
export default fixPickHandler;
