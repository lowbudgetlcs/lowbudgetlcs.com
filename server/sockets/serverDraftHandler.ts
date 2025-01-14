import { Socket } from "socket.io";

export const draftHandler = async (
  socket: Socket,
  lobbyCode: string,
  blueUser: string,
  redUser: string
) => {
  let banPhase1: number = 6;
  let banPhase2: number = 4;
  const bansArray: Array<string> = [];
  console.log("Ban Phase Starting");
  //   Tells client ban phase has begun then runs first ban phase
  socket.to(lobbyCode).emit("banPhase", true);

  // Runs ban phase while total bans is less than 6
  const handleTurn = async (currentSide: string) => {
    let timer = 8;
    return new Promise((resolve: any) => {
      let interval = setInterval(() => {
        timer--;
        console.log(timer);
        socket.to(lobbyCode).emit("timer", timer);
        if (timer <= 0) {
          clearInterval(interval);
          console.log("timer finished. ", `${currentSide} chose nothing`);
          bansArray.push("nothing");
          resolve();
        }
      }, 1000);

      socket.once("ban", (sideCode, ban) => {
        if (sideCode === currentSide) {
          clearInterval(interval);
          bansArray.push(ban);
          console.log("Ban has been given: ", ban);
          resolve();
        }
      });
      socket.to(lobbyCode).emit("banTurn", currentSide);
    });
  };

  // Blue side's turn
  const startBanPhase = async () => {
    for (let i = 0; i < banPhase1; i++) {
      const isBlueTurn = i % 2 === 0;
      //   Use this to track current side making the turn
      const currentSide = isBlueTurn ? blueUser : redUser;
      await handleTurn(currentSide);
    }
  };
  await startBanPhase();
  console.log("Ban Phase 1 is complete :)")
};
