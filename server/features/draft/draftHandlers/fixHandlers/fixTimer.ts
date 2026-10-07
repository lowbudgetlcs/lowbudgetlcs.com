import { updateClientState } from "../../models/clientDraftState";
import { HandlerVarsProps } from "../../models/draftState";

const fixTimer = async (handlerVars: HandlerVarsProps) => {
  const { io, lobbyCode, state } = handlerVars;
  let timer = 5 * 60 * 1000;

  return new Promise((resolve) => {
    io.to(lobbyCode).emit("fixTimerStarted", { timer });

    const interval = setInterval(() => {
      timer--;
      state.timer = timer;
      io.to(lobbyCode).emit("timer", timer);
      if (timer <= 0) {
        clearInterval(interval);
        io.to(lobbyCode).emit("endFixTime", updateClientState(lobbyCode));
        resolve(true);
      }
    }, 1000);
  });
};

export default fixTimer;
