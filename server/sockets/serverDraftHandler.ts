import { Socket } from "socket.io";

export const draftHandler = async (
  socket: Socket,
  lobbyCode: string,
  blueUser: string,
  redUser: string
) => {
  let timer = 34;
  let shownTimer = timer - 4;
  let currentTurn: string;
  let totalBans: number = 0;
  let banPhase1: number = 0;
  let banPhase2: number = 0;
  const redBans: Array<string> = [];
  const blueBans: Array<string> = [];
  console.log("Ban Phase Starting");
  //   Tells client ban phase has begun then runs first ban phase
  socket.to(lobbyCode).emit("banPhase", true);

  let interval = setInterval(() => {
    if (timer <= 0) {
      console.log("timer finished");
      clearInterval(interval);
    } else {
      console.log(timer);
      socket.emit("timer", timer);
      timer--;
    }
  }, 1000);
  // Runs ban phase while total bans is less than 6
  if (banPhase1 < 6) {
    console.log("currentBan: ", banPhase1);
    currentTurn = blueUser;
    while (currentTurn === blueUser) {
      socket.on("ban", ({ sideCode, ban }) => {
        if (sideCode === blueUser || timer === 0) {
          if (!ban) {
            blueBans.push("nothing");
            console.log("Blue Turn Finished");
            return (currentTurn = blueUser);
          }
          blueBans.push(ban);
          console.log("Blue Turn Finished");
          return (currentTurn = redUser);
        }
      });
    }
    while (currentTurn === redUser) {
      socket.on("ban", ({ sideCode, ban }) => {
        if (sideCode === redUser || timer === 0) {
          if (!ban) {
            redBans.push("nothing");
            console.log("Red Turn Finished");
            return (currentTurn = blueUser);
          }
          redBans.push(ban);
          console.log("Red Turn Finished");
          return (currentTurn = blueUser);
        }
      });
    }
  }

  // Blue side's turn
};
