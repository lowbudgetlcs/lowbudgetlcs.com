import { Namespace, Socket } from "socket.io";
import { DraftStateProps } from "../../states/draftState";

interface HoverHandlerProps {
  lobbyCode: string;
  sideCode: string;
  chosenChamp: string;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  socket: Socket;
  io: Namespace;
}

const clientHoverHandler = ({
  lobbyCode,
  sideCode,
  chosenChamp,
  getDraftState,
  socket,
  io,
}: HoverHandlerProps) => {
  const state = getDraftState(lobbyCode);

  if (!state) {
    socket.emit("error", { invalidDraftID: true });
    return;
  }

  if (state.activePhase && state.activePhase !== "finished") {
    if (state.currentTurn === sideCode) {
      if (state.phaseType === "ban") {
        state.currentHover = chosenChamp;

        sideCode === state.blueUser
          ? (state.bluePick = chosenChamp)
          : (state.redPick = chosenChamp);

        io.to(lobbyCode).emit("banHover", state);
      } else if (state.phaseType === "pick") {
        state.currentHover = chosenChamp;

        sideCode === state.blueUser
          ? (state.bluePick = chosenChamp)
          : (state.redPick = chosenChamp);

        io.to(lobbyCode).emit("pickHover", state);
      }
    }
  }
};

export default clientHoverHandler;
