import { Server, Socket } from "socket.io";
import { DraftStateProps } from "./serverDraftHandler";

export const banPhase1Handler = async (
  io: Server,
  socket: Socket,
  lobbyCode: string,
  state: DraftStateProps
): Promise<boolean> => {
  if (state.activePhase !== "banPhase1") {
    return false;
  }

  return new Promise((resolve, reject) => {
    const bansPhase1 = [
      state.blueUser,
      state.redUser,
      state.redUser,
      state.blueUser,
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
            io.to(lobbyCode).emit("setBan", { chosenChamp: "nothing" });
            resolve();
          }
        }, 1000);

        const banListener = (data: {
          sideCode: string;
          chosenChamp: string;
        }) => {
          console.log("Ban received");
          const { sideCode, chosenChamp } = data;
          if (sideCode === currentSide) {
            clearInterval(interval);
            console.log(`${currentSide} banned: ${chosenChamp}`);
            state.bansArray.push(chosenChamp);
            io.to(lobbyCode).emit("setBan", { chosenChamp });
            socket.off("ban", banListener);
            resolve();
          }
        };
        socket.on("ban", banListener);
        io.to(lobbyCode).emit("banTurn", currentSide);
      });
    };

    startBanPhase().catch((err) => {
      console.error("Error during ban phase:", err);
      reject(err);
    });
  });
};
