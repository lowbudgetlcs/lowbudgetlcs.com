import { HandlerVarsProps } from "../../states/draftState";
import { updateClientState } from "../../states/clientDraftState";

const fixPhaseHandler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "fix") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const startFixPhase = async () => {
      io.to(lobbyCode).emit("fixPhase", updateClientState(lobbyCode));
      state.phaseType = "fix";
      let timer = 64;

      const interval = setInterval(() => {
        timer--;
        state.timer = timer;
        io.to(lobbyCode).emit("timer", timer);

        if (timer <= 0) {
          clearInterval(interval);
          emitter.off("blueFixPick", fixListener);
          emitter.off("redFixPick", fixListener);
          emitter.off("blueAccept", blueAcceptListener);
          emitter.off("redAccept", redAcceptListener);
          io.to(lobbyCode).emit("endFixPhase", true);
          resolve(true);
        }
      }, 1000);

      const fixListener = () => {
        if (state.blueFixPick) {
          io.to(lobbyCode).emit("askRedToAcceptPick", updateClientState(lobbyCode));
        } else if (state.redFixPick) {
          io.to(lobbyCode).emit("askBlueToAcceptPick", updateClientState(lobbyCode));
        }
      };

      const blueAcceptListener = (accepted: boolean) => {
        if (accepted) {
          if (!state.blueFixPick) return;

          // Find the index of the old pick in the pick arrays
          const foundChampFullPicks = state.picksArray.indexOf(state.blueFixPick[0]);
          const foundChampPicks = state.bluePicks.indexOf(state.blueFixPick[0]);

          // Find the index of the old pick in the ban arrays
          const foundChampFullBans = state.bansArray.indexOf(state.blueFixPick[0]);
          const foundChampBans = state.blueBans.indexOf(state.blueFixPick[0]);

          if (foundChampFullPicks !== -1 && foundChampPicks !== -1) {
            // The champion was a pick. Replaces it in both pick arrays.
            state.picksArray[foundChampFullPicks] = state.blueFixPick[1];
            state.bluePicks[foundChampPicks] = state.blueFixPick[1];
            console.log("Replaced champion pick.");
            io.to(lobbyCode).emit("blueFixAccepted", updateClientState(lobbyCode));
          } else if (foundChampFullBans !== -1 && foundChampBans !== -1) {
            // The champion was a ban. Replaces it in both ban arrays.
            state.bansArray[foundChampFullBans] = state.blueFixPick[1];
            state.blueBans[foundChampBans] = state.blueFixPick[1];
            console.log("Replaced champion ban.");
            io.to(lobbyCode).emit("blueFixAccepted", updateClientState(lobbyCode));
          } else {
            console.error("Old pick not found in any array in blue accept: ", lobbyCode);
            io.to(lobbyCode).emit("blueFixDenied", updateClientState(lobbyCode));
          }
          state.blueFixPick = undefined;
          state.redAcceptPick = undefined;
        } else {
          state.blueFixPick = undefined;
          io.to(lobbyCode).emit("blueFixDenied", updateClientState(lobbyCode));
        }
      };

      const redAcceptListener = (accepted: boolean) => {
        if (accepted) {
          if (!state.redFixPick) return;

          // Find the index of the old pick in the pick arrays
          const foundChampFullPicks = state.picksArray.indexOf(state.redFixPick[0]);
          const foundChampPicks = state.redPicks.indexOf(state.redFixPick[0]);

          // Find the index of the old pick in the ban arrays
          const foundChampFullBans = state.bansArray.indexOf(state.redFixPick[0]);
          const foundChampBans = state.redBans.indexOf(state.redFixPick[0]);

          if (foundChampFullPicks !== -1 && foundChampPicks !== -1) {
            // The champion was a pick. Replaces it in both pick arrays.
            state.picksArray[foundChampFullPicks] = state.redFixPick[1];
            state.redPicks[foundChampPicks] = state.redFixPick[1];
            console.log("Replaced champion pick.");
            io.to(lobbyCode).emit("redFixAccepted", updateClientState(lobbyCode));
          } else if (foundChampFullBans !== -1 && foundChampBans !== -1) {
            // The champion was a ban. Replaces it in both ban arrays.
            state.bansArray[foundChampFullBans] = state.redFixPick[1];
            state.redBans[foundChampBans] = state.redFixPick[1];
            console.log("Replaced champion ban.");
            io.to(lobbyCode).emit("redFixAccepted", updateClientState(lobbyCode));
          } else {
            console.error("Old pick not found in any array in red accept: ", lobbyCode);
            io.to(lobbyCode).emit("redFixDenied", updateClientState(lobbyCode));
          }
          state.redFixPick = undefined;
          state.blueAcceptPick = undefined;
        } else {
          state.redFixPick = undefined;
          io.to(lobbyCode).emit("redFixDenied", updateClientState(lobbyCode));
        }
      };

      emitter.on("blueFixPick", fixListener);
      emitter.on("redFixPick", fixListener);
      emitter.on("blueAccept", blueAcceptListener);
      emitter.on("redAccept", redAcceptListener);
    };

    startFixPhase().catch((err) => {
      console.error("Error during fix phase:", err);
      reject(err);
    });
  });
};

export default fixPhaseHandler;
