import { Server, Socket } from "socket.io";
import { DraftStateProps } from "./draftState";
import EventEmitter from "events";

export const pickPhase2Handler = async (
  io: Server,
  socket: Socket,
  lobbyCode: string,
  state: DraftStateProps,
  emitter: EventEmitter
): Promise<boolean> => {
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
      console.log("Pick Phase Starting");
      io.to(lobbyCode).emit("pickPhase", state);
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
            io.to(lobbyCode).emit("currentTurn", state);
          } else if (currentSide === state.redUser) {
            state.displayTurn = "red";
            io.to(lobbyCode).emit("currentTurn", state);
          }
          await handleTurn(currentSide);
          console.log("Switching turns");
        } catch (err) {
          console.error("Error during turn:", err);
          reject(err);
          return;
        }
      }
      state.pickIndex = 0;
      console.log("Pick Phase 2 is complete :)");
      io.to(lobbyCode).emit("endPickPhase", true);
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

            // Add nothing pick to side array
            if (currentSide === state.blueUser) {
              state.bluePicks.push("nothing");
            }
            if (currentSide === state.redUser) {
              state.redPicks.push("nothing");
            }

            io.to(lobbyCode).emit("setPick", state);
            // Shut of listener incase it still is attached
            emitter.off("bluePick", pickListener);
            emitter.off("redPick", pickListener);
            resolve();
          }
        }, 1000);

        const pickListener = () => {
          if (state.bluePick) {
            if (currentSide === state.blueUser) {
              console.log("Pick received");
              clearInterval(interval);
              console.log(`${currentSide} picked: ${state.bluePick}`);
              state.bluePicks.push(state.bluePick);
              io.to(lobbyCode).emit("setPick", state);
              // Shut of listener incase it still is attached
              emitter.off("bluePick", pickListener);
              emitter.off("redPick", pickListener);
              resolve();
            }
          } else if (state.redPick) {
            if (currentSide === state.redUser) {
              console.log("Pick received");
              clearInterval(interval);
              console.log(`${currentSide} picked: ${state.redPick}`);
              state.redPicks.push(state.redPick);
              io.to(lobbyCode).emit("setPick", state);
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
