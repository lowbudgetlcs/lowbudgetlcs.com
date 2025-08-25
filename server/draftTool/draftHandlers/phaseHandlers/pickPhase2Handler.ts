import { HandlerVarsProps } from "../../states/draftState";
import { updateClientState } from "../../states/clientDraftState";

export const pickPhase2Handler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "pickPhase2") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const picksPhase2 = [
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
        state.pickIndex < picksPhase2.length;
        state.pickIndex++
      ) {
        const currentSide = picksPhase2[state.pickIndex];
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
      state.pickIndex = 0;
      io.to(lobbyCode).emit("endPickPhase", true);
      resolve(true);
    };

    const handleTurn = (currentSide: string): Promise<void> => {
      let timer = 34;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          timer--;
          state.timer = timer;
          io.to(lobbyCode).emit("timer", timer);
          if (timer <= 0) {
            clearInterval(interval);
            emitter.off("bluePick", bluePickListener);
            emitter.off("redPick", redPickListener);

            const pick =
              currentSide === state.blueUser ? state.bluePick : state.redPick;
            const finalPick = pick || "nothing";

            // Add nothing pick to side array
            if (currentSide === state.blueUser) {
              state.bluePicks.push(finalPick);
              state.picksArray.push(finalPick);
              state.currentBluePick++;
            } else if (currentSide === state.redUser) {
              state.redPicks.push(finalPick);
              state.picksArray.push(finalPick);
              state.currentRedPick++;
            }
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));
            resolve();
          }
        }, 1000);

        const bluePickListener = (pickedChamp: string) => {
          if (currentSide === state.blueUser) {
            clearInterval(interval);
            state.bluePicks.push(pickedChamp);
            state.picksArray.push(pickedChamp);
            state.currentBluePick++;
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));
            emitter.off("redPick", redPickListener);
            resolve();
          }
        };

        const redPickListener = (pickedChamp: string) => {
          if (currentSide === state.redUser) {
            clearInterval(interval);
            state.redPicks.push(pickedChamp);
            state.picksArray.push(pickedChamp);
            state.currentRedPick++;
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setPick", updateClientState(lobbyCode));
            emitter.off("bluePick", bluePickListener);
            resolve();
          }
        };
        emitter.once("bluePick", bluePickListener);
        emitter.once("redPick", redPickListener);
      });
    };

    startPickPhase().catch((err) => {
      console.error("Error during pick phase:", err);
      reject(err);
    });
  });
};
