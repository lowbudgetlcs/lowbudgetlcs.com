import { Namespace, Socket } from "socket.io";
import { DraftStateProps, HandlerVarsProps } from "../../states/draftState";
import EventEmitter from "events";
import { read } from "fs";
import { readyHandler } from "../phaseHandlers/readyHandler";
import { updateClientState } from "../../states/clientDraftState";
import phaseTransition from "../phaseHandlers/phaseTransition";

interface ReadyHandlerProps {
  lobbyCode: string;
  sideCode: string;
  ready: boolean;
  getDraftState: (lobbyCode: string) => DraftStateProps | null;
  lobbyEmitters: Map<string, EventEmitter>;
  socket: Socket;
  io: Namespace;
}

const readySocketHandler = async ({
  lobbyCode,
  sideCode,
  ready,
  getDraftState,
  lobbyEmitters,
  socket,
  io,
}: ReadyHandlerProps) => {
  const state = getDraftState(lobbyCode);
  // Redundant but I don't trust myself
  if (!state) {
    socket.emit("error", { invalidDraftID: true });
    return;
  }

  const isDraftReady = readyHandler(state, sideCode, ready, lobbyCode, io);

  // Phases can be interchangable or added to
  // Add them in phaseTransition.ts function first
  const availablePhases: string[] = [
    "banPhase1",
    "pickPhase1",
    "banPhase2",
    "pickPhase2",
    "fix",
    "finished",
  ];

  const draftPhases = () => {
    const defaultPhases = ["banPhase1", "pickPhase1", "banPhase2", "pickPhase2", "finished"];
    if (state.addedPhases.length > 0) {
      return [
        "banPhase1",
        "pickPhase1",
        "banPhase2",
        "pickPhase2",
        ...state.addedPhases,
        "finished",
      ];
    }
    return defaultPhases;
  };

  if (isDraftReady) {
    state.draftStarted = true;
    state.currentHover = null;
    state.activePhase = "banPhase1";
    io.to(lobbyCode).emit("startBanPhase1", updateClientState(lobbyCode));

    const emitter = lobbyEmitters.get(lobbyCode);
    if (!emitter) {
      console.error(`No EventEmitter found for lobby ${lobbyCode}`);
      return;
    }

    const handlerVars: HandlerVarsProps = {
      io: io,
      lobbyCode: lobbyCode,
      state: state,
      emitter: emitter,
    };

    // Handles all draft phases in order
    for (const phase of draftPhases()) {
      state.activePhase = phase as DraftStateProps["activePhase"];
      await phaseTransition(handlerVars, phase);
    }
    lobbyEmitters.delete(lobbyCode);
  }
};

export default readySocketHandler;
