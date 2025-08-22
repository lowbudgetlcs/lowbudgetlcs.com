import { HandlerVarsProps } from "../../states/draftState";
import { updateClientState } from "../../states/clientDraftState";

export const banPhase2Handler = async ({
  io,
  lobbyCode,
  state,
  emitter,
}: HandlerVarsProps): Promise<boolean> => {
  if (state.activePhase !== "banPhase2") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const bansPhase2 = [
      state.redUser,
      state.blueUser,
      state.redUser,
      state.blueUser,
    ];

    const startBanPhase = async () => {
      io.to(lobbyCode).emit("banPhase", updateClientState(lobbyCode));
      state.phaseType = "ban";

      for (
        state.banIndex;
        state.banIndex < bansPhase2.length;
        state.banIndex++
      ) {
        const currentSide = bansPhase2[state.banIndex];
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
            emitter.off("bluePick", blueBanListener);
            emitter.off("redPick", redBanListener);

            const pick =
              currentSide === state.blueUser ? state.bluePick : state.redPick;
            const finalPick = pick || "nothing";

            if (currentSide === state.blueUser) {
              state.blueBans.push(finalPick);
              state.bansArray.push(finalPick);
              state.currentBlueBan++;
            } else if (currentSide === state.redUser) {
              state.redBans.push(finalPick);
              state.bansArray.push(finalPick);
              state.currentRedBan++;
            }
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
            resolve();
          }
        }, 1000);

        const blueBanListener = (bannedChamp: string) => {
          if (currentSide === state.blueUser) {
            clearInterval(interval);
            state.blueBans.push(bannedChamp);
            state.bansArray.push(bannedChamp);
            state.currentBlueBan++;
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
            emitter.off("redPick", redBanListener);
            resolve();
          }
        };

        const redBanListener = (bannedChamp: string) => {
          if (currentSide === state.redUser) {
            clearInterval(interval);
            state.redBans.push(bannedChamp);
            state.bansArray.push(bannedChamp);
            state.currentRedBan++;
            state.bluePick = null;
            state.redPick = null;
            state.currentHover = null;
            io.to(lobbyCode).emit("setBan", updateClientState(lobbyCode));
            emitter.off("bluePick", blueBanListener);
            resolve();
          }
        };
        emitter.once("bluePick", blueBanListener);
        emitter.once("redPick", redBanListener);
      });
    };

    startBanPhase().catch((err) => {
      console.error("Error during ban phase:", err);
      reject(err);
    });
  });
};
