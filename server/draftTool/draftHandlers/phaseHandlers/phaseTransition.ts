import { updateClientState } from "../../states/clientDraftState";
import { HandlerVarsProps } from "../../states/draftState";
import { banPhase1Handler } from "./banPhase1Handler";
import { banPhase2Handler } from "./banPhase2Handler";
import { endDraftHandler } from "./endDraftHandler";
import fixPhaseHandler from "./fixPhaseHandler";
import { pickPhase1Handler } from "./pickPhase1Handler";
import { pickPhase2Handler } from "./pickPhase2Handler";

const phaseTransition = async (handlerVars: HandlerVarsProps, activePhase: string) => {
  const { io, lobbyCode, state } = handlerVars;

  switch (state.activePhase) {
    case "banPhase1":
      state.draftStarted = true;
      state.currentHover = null;
      state.activePhase = "banPhase1";
      io.to(lobbyCode).emit("startBanPhase1", updateClientState(lobbyCode));
      await banPhase1Handler(handlerVars);
      break;
    case "pickPhase1":
      state.currentHover = null;
      state.activePhase = "pickPhase1";
      io.to(lobbyCode).emit("startPickPhase1", updateClientState(lobbyCode));
      await pickPhase1Handler(handlerVars);
      break;
    case "banPhase2":
      state.currentHover = null;
      state.activePhase = "banPhase2";
      io.to(lobbyCode).emit("startBanPhase2", updateClientState(lobbyCode));
      await banPhase2Handler(handlerVars);
      break;
    case "pickPhase2":
      state.currentHover = null;
      state.activePhase = "pickPhase2";
      io.to(lobbyCode).emit("startPickPhase2", updateClientState(lobbyCode));
      await pickPhase2Handler(handlerVars);
      break;
    case "fix":
      state.currentHover = null;
      state.activePhase = "fix";
      io.to(lobbyCode).emit("startFixPhase", updateClientState(lobbyCode));
      await fixPhaseHandler(handlerVars)
      break;
    case "finished":
      await endDraftHandler(handlerVars);
      if (state.fearlessCode) {
        const draftSockets = await io.in(lobbyCode).fetchSockets();
        draftSockets.forEach((socket) => {
          socket.leave(lobbyCode);
        });
      } else {
        io.in(lobbyCode).disconnectSockets();
      }
  }
};

export default phaseTransition;
