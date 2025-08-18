import { HandlerVarsProps } from "../../states/draftState";
import { updateClientState } from "../../states/clientDraftState";

export const banPhase1Handler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "banPhase1") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const bansPhase1 = [
      state.blueUser,
      state.redUser,
      state.blueUser,
      state.redUser,
      state.blueUser,
      state.redUser,
    ];

    const startBanPhase = async () => {
      io.to(lobbyCode).emit("banPhase", updateClientState(lobbyCode));
      state.phaseType = "ban";

      for (
        state.banIndex;
        state.banIndex < bansPhase1.length;
        state.banIndex++
      ) {
        const currentSide = bansPhase1[state.banIndex];
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
      //   resets banIndex to be used in ban phase 2
      state.banIndex = 0;
      io.to(lobbyCode).emit("endBanPhase", true);
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
            if (currentSide === state.blueUser) {
              if (state.bluePick) {
                state.blueBans.push(state.bluePick);
                state.bansArray.push(state.bluePick);
                state.bluePick = null;
                state.currentBlueBan++;
              } else {
                state.blueBans.push("nothing");
                state.bansArray.push("nothing");
                state.currentBlueBan++;
                state.bluePick = null;
              }
            } else if (currentSide === state.redUser) {
              if (state.redPick) {
                state.redBans.push(state.redPick);
                state.bansArray.push(state.redPick);
                state.redPick = null;
                state.currentRedBan++;
              } else {
                state.redBans.push("nothing");
                state.bansArray.push("nothing");
                state.currentRedBan++;
                state.redPick = null;
              }
            }
            io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
            // Shut of listener incase it still is attached
            emitter.off("bluePick", banListener);
            emitter.off("redPick", banListener);
            resolve();
          }
        }, 1000);

        const banListener = () => {
          if (state.bluePick) {
            if (currentSide === state.blueUser) {
              clearInterval(interval);
              state.blueBans.push(state.bluePick);
              state.bansArray.push(state.bluePick);
              io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
              state.bluePick = null;
              state.currentBlueBan++;
              // Shut of listener incase it still is attached
              emitter.off("bluePick", banListener);
              emitter.off("redPick", banListener);
              resolve();
            }
          } else if (state.redPick) {
            if (currentSide === state.redUser) {
              clearInterval(interval);
              state.redBans.push(state.redPick);
              state.bansArray.push(state.redPick);
              io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
              state.redPick = null;
              state.currentRedBan++;
              // Shut of listener incase it still is attached
              emitter.off("bluePick", banListener);
              emitter.off("redPick", banListener);
              resolve();
            }
          }
        };
        emitter.once("bluePick", banListener);
        emitter.once("redPick", banListener);
      });
    };

    startBanPhase().catch((err) => {
      console.error("Error during ban phase:", err);
      reject(err);
    });
  });
};
