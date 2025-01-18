import { Server, Socket } from "socket.io";
import { DraftStateProps } from "./serverDraftHandler";
import EventEmitter from "events";

export const banPhase1Handler = async (
  io: Server,
  socket: Socket,
  lobbyCode: string,
  state: DraftStateProps,
  emitter: EventEmitter
): Promise<boolean> => {
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
      console.log("Ban Phase Starting");
      io.to(lobbyCode).emit("banPhase", true);

      for (
        state.banIndex;
        state.banIndex < bansPhase1.length;
        state.banIndex++
      ) {
        const currentSide = bansPhase1[state.banIndex];
        state.currentTurn = currentSide;
        console.log("It is currently: ", currentSide,"'s Turn.....")
        try {
          console.log("Current turn:", currentSide);
          io.to(lobbyCode).emit("currentTurn", currentSide);

          await handleTurn(currentSide);
          console.log("Switching turns");
        } catch (err) {
          console.error("Error during turn:", err);
          reject(err);
          return;
        }
      }
      //   resets banIndex to be used in ban phase 2
      state.banIndex = 0;
      console.log("Ban Phase 1 is complete :)");
      resolve(true);
    };

    const handleTurn = (currentSide: string): Promise<void> => {
      let timer = 34;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          timer--;
          state.timer = timer;
          console.log(`Timer: ${timer}`);
          io.to(lobbyCode).emit("timer", timer);

          if (timer <= 0) {
            clearInterval(interval);
            console.log(`Timer expired for ${currentSide}.`);
            state.bansArray.push("nothing");
            io.to(lobbyCode).emit("setBan", { bannedChampion: "nothing" });
            resolve();
          }
        }, 1000);

        const banListener = () => {
          if (state.bluePick) {
            if (currentSide === state.blueUser) {
              console.log("Ban received");
              clearInterval(interval);
              console.log(`${currentSide} banned: ${state.bluePick}`);
              state.bansArray.push(state.bluePick);
              io.to(lobbyCode).emit("setBan", { bannedChampion: state.bluePick });
              resolve();
            }
          } else if (state.redPick) {
            if (currentSide === state.redUser) {
              console.log("Ban received");
              clearInterval(interval);
              console.log(`${currentSide} banned: ${state.redPick}`);
              state.bansArray.push(state.redPick);
              io.to(lobbyCode).emit("setBan", { bannedChampion: state.redPick });
              resolve();
            }
          }
        };
        emitter.on('bluePick', banListener);
        emitter.on('redPick', banListener);
        io.to(lobbyCode).emit("banTurn", currentSide);
      });
    };

    startBanPhase().catch((err) => {
      console.error("Error during ban phase:", err);
      reject(err);
    });
  });
};
