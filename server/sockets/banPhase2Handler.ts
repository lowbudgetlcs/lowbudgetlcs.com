import { Server, Socket } from "socket.io";
import { DraftStateProps } from "./draftStateInitializer";
import EventEmitter from "events";

export const banPhase2Handler = async (
  io: Server,
  socket: Socket,
  lobbyCode: string,
  state: DraftStateProps,
  emitter: EventEmitter
): Promise<boolean> => {
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
      console.log("Ban Phase 2 Starting");
      io.to(lobbyCode).emit("banPhase", state);
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
            io.to(lobbyCode).emit("currentTurn", state);
          } else if (currentSide === state.redUser) {
            state.displayTurn = "red";
            io.to(lobbyCode).emit("currentTurn", state);
          }
          console.log(state.banIndex);
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
      console.log("Ban Phase 2 is complete :)");
      io.to(lobbyCode).emit("endBanPhase", true);
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
            if (currentSide === state.blueUser) {
              state.blueBans.push("nothing");
            } else if (currentSide === state.redUser) {
              state.redBans.push("nothing");
            }
            io.to(lobbyCode).emit("setBan", state);
            // Shut of listener incase it still is attached
            emitter.off("bluePick", banListener);
            emitter.off("redPick", banListener);
            resolve();
          }
        }, 1000);

        const banListener = () => {
          if (state.bluePick) {
            if (currentSide === state.blueUser) {
              console.log("Ban received");
              clearInterval(interval);
              console.log(`${currentSide} banned: ${state.bluePick}`);
              state.blueBans.push(state.bluePick);
              io.to(lobbyCode).emit("setBan", state);
              // Shut of listener incase it still is attached
              emitter.off("bluePick", banListener);
              emitter.off("redPick", banListener);
              resolve();
            }
          } else if (state.redPick) {
            if (currentSide === state.redUser) {
              console.log("Ban received");
              clearInterval(interval);
              console.log(`${currentSide} banned: ${state.redPick}`);
              state.redBans.push(state.redPick);
              io.to(lobbyCode).emit("setBan", state);
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
