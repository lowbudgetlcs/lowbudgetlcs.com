import EventEmitter from "events";
import { DraftStateProps } from "../../states/draftState";
import { Socket } from "socket.io";

interface AcceptFixPickHandlerProps {
  lobbyCode: string;
  sideCode: string;
  accepted: boolean;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  lobbyEmitters: Map<string, EventEmitter>;
  socket: Socket;
}

const acceptFixPickHandler = ({
  lobbyCode,
  sideCode,
  accepted,
  getDraftState,
  lobbyEmitters,
  socket,
}: AcceptFixPickHandlerProps) => {
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

  if (sideCode === state.blueUser && state.redFixPick) {
    state.blueAcceptPick = accepted;
    lobbyEmitters.get(lobbyCode)?.emit("redAccept", accepted);
  } else if (sideCode === state.redUser && state.blueFixPick) {
    state.redAcceptPick = accepted;
    lobbyEmitters.get(lobbyCode)?.emit("blueAccept", accepted);
  }
};
export default acceptFixPickHandler;
