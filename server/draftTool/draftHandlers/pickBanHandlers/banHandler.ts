import EventEmitter from "events";
import { DraftStateProps } from "../../states/draftState";
import { Socket } from "socket.io";

interface banHandlerProps {
  lobbyCode: string;
  sideCode: string;
  chosenChamp: string;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  lobbyEmitters: Map<string, EventEmitter>;
  socket: Socket;
}

const banHandler = ({
  lobbyCode,
  sideCode,
  chosenChamp,
  getDraftState,
  lobbyEmitters,
  socket,
}: banHandlerProps) => {
  const state = getDraftState(lobbyCode);
  // Redundant but I don't trust myself
  if (!state) {
    socket.emit("error", { invalidDraftID: true });
    return;
  }

  if (state.activePhase !== "banPhase1" && state.activePhase !== "banPhase2") {
    console.error("We are not in ban phase");
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
    lobbyEmitters.get(lobbyCode)!.emit("bluePick", chosenChamp);
  } else if (sideCode === state.redUser && sideCode === state.currentTurn) {
    lobbyEmitters.get(lobbyCode)!.emit("redPick", chosenChamp);
  }
};

export default banHandler;
