import { Server, Socket } from "socket.io";

export const draftHandler = async (
  io: Server,
  socket: Socket,
  lobbyCode: string,
  blueUser: string,
  redUser: string
) => {
  let banPhaseStart = false;
  const bansPhase1 = [blueUser, redUser, redUser, blueUser, blueUser, redUser];
  const bansPhase2 = [redUser, blueUser, blueUser, redUser];
  const picksPhase1 = [blueUser, redUser, redUser, blueUser, blueUser, redUser];
  const picksPhase2 = [redUser, blueUser, blueUser, redUser];
  const bansArray: Array<string> = [];
  // Runs ban phase while total bans is less than 6
  const handleTurn = async (currentSide: string) => {
    let timer = 34;
    return new Promise<void>((resolve) => {
      let interval = setInterval(() => {
        timer--;
        console.log(timer);
        io.to(lobbyCode).emit("timer", timer);
        if (timer <= 0) {
          clearInterval(interval);
          console.log("timer finished. ", `${currentSide} chose nothing`);
          bansArray.push("nothing");
          resolve();
        }
      }, 1000);

      const banListener = ({
        sideCode,
        chosenChamp,
      }: {
        sideCode: string;
        chosenChamp: string;
      }) => {
        console.log("Ban Recieved: ", chosenChamp);
        if (sideCode === currentSide) {
          clearInterval(interval);
          bansArray.push(chosenChamp);
          console.log("Ban has been given: ", chosenChamp);
          io.to(lobbyCode).emit("setBan", { chosenChamp });
          resolve();
        }
      };
      socket.on("ban", banListener);

      io.to(lobbyCode).emit("banTurn", currentSide);
    });
  };

  // Blue side's turn
  const startBanPhase = async () => {
    for (const currentSide of bansPhase1) {
      console.log("currentTurn: ", currentSide);
      io.to(lobbyCode).emit("currentTurn", currentSide);
      await handleTurn(currentSide);
      console.log("switching turns");
    }
  };
  console.log("Ban Phase Starting");
  // Tells client ban phase has begun then runs first ban phase
  io.to(lobbyCode).emit("banPhase", true);
  banPhaseStart = true;
  await startBanPhase();
  console.log("Ban Phase 1 is complete :)");
};
