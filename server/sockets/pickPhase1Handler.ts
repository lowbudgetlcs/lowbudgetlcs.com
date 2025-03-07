import { HandlerVarsProps } from "./draftState";
import { updateClientState } from "./clientDraftState";

export const pickPhase1Handler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "pickPhase1") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const picksPhase1 = [
      state.blueUser,
      state.redUser,
      state.redUser,
      state.blueUser,
      state.blueUser,
      state.redUser,
    ];

    const startPickPhase = async () => {
      io.to(lobbyCode).emit("pickPhase", updateClientState(lobbyCode));
      state.phaseType = "pick";
      for (
        state.pickIndex;
        state.pickIndex < picksPhase1.length;
        state.pickIndex++
      ) {
        const currentSide = picksPhase1[state.pickIndex];
        state.currentTurn = currentSide;
        try {
          // Display Current Turn in Client
          if (currentSide === state.blueUser) {
            state.displayTurn = "blue";
            io.to(lobbyCode).emit("currentTurn", updateClientState(lobbyCode));
          } else if (currentSide === state.redUser) {
            state.displayTurn = "red";
            io.to(lobbyCode).emit("currentTurn", updateClientState(lobbyCode));
          }
          await handleTurn(currentSide);
        } catch (err) {
          console.error("Error during turn:", err);
          reject(err);
          return;
        }
      }
      //   resets pickIndex to be used in pick phase 2
      state.pickIndex = 0;
      io.to(lobbyCode).emit("endPickPhase", true);
      resolve(true);
    };

    const handleTurn = (currentSide: string): Promise<void> => {
      let timer: number = 34;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          timer--;
          state.timer = timer;
          io.to(lobbyCode).emit("timer", timer);

          if (timer <= 0) {
            clearInterval(interval);

            // Add nothing pick to side array
            if (currentSide === state.blueUser) {
              state.bluePicks.push("nothing");
            }
            if (currentSide === state.redUser) {
              state.redPicks.push("nothing");
            }

            io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));

            // Shut of listener incase it still is attached
            emitter.off("bluePick", pickListener);
            emitter.off("redPick", pickListener);
            resolve();
          }
        }, 1000);

        const pickListener = () => {
          if (state.bluePick) {
            if (currentSide === state.blueUser) {
              clearInterval(interval);
              state.bluePicks.push(state.bluePick);
              io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));
              // Shut of listener incase it still is attached
              emitter.off("bluePick", pickListener);
              emitter.off("redPick", pickListener);
              resolve();
            }
          } else if (state.redPick) {
            if (currentSide === state.redUser) {
              clearInterval(interval);
              state.redPicks.push(state.redPick);
              io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));
              // Shut of listener incase it still is attached
              emitter.off("bluePick", pickListener);
              emitter.off("redPick", pickListener);
              resolve();
            }
          }
        };
        emitter.once("bluePick", pickListener);
        emitter.once("redPick", pickListener);
      });
    };

    startPickPhase().catch((err) => {
      console.error("Error during pick phase:", err);
      reject(err);
    });
  });
};
