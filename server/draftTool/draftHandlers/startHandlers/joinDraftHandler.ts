import EventEmitter from "events";
import { Namespace, Socket } from "socket.io";
import { DraftStateProps } from "../../states/draftState";
import { updateClientState } from "../../states/clientDraftState";

interface JoinDraftHandlerProps {
  lobbyCode: string;
  sideCode: string;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  lobbyEmitters: Map<string, EventEmitter>;
  socket: Socket;
}

const joinDraftHandler = ({
  lobbyCode,
  sideCode,
  getDraftState,
  lobbyEmitters,
  socket,
}: JoinDraftHandlerProps) => {
  try {
    const state = getDraftState(lobbyCode);

    // Redundant but I don't trust myself
    if (!state) {
      socket.emit("error", { invalidDraftID: true });
      return;
    }
    const redCode = state.redUser;
    const blueCode = state.blueUser;

    // Initialize EventEmitter for this lobby if not already
    if (!lobbyEmitters.has(lobbyCode)) {
      lobbyEmitters.set(lobbyCode, new EventEmitter());
    }

    // Join room
    socket.join(lobbyCode);

    let sideDisplay: string | null =
      sideCode === blueCode ? "blue" : sideCode === redCode ? "red" : "spectator";

    socket.emit("joinedDraft", {
      success: true,
      sideCode,
      lobbyCode,
      sideDisplay,
    });

    socket.emit("state", updateClientState(lobbyCode));
  } catch (error) {
    console.error("Error during role assignment:", error);
    socket.emit("error", { message: "Internal server error." });
    socket.disconnect();
  }
};

export default joinDraftHandler;
