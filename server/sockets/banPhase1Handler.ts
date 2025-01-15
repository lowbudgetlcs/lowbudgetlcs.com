import { Server, Socket } from "socket.io";

export const banPhase1Handler = async (
    io: Server,
    socket: Socket,
    lobbyCode: string,
    blueUser: string,
    redUser: string
  ) => {
    try {
      let banPhaseStart = false;
      const bansPhase1 = [
        blueUser,
        redUser,
        redUser,
        blueUser,
        blueUser,
        redUser,
      ];
      const bansPhase2 = [redUser, blueUser, blueUser, redUser];
      const picksPhase1 = [
        blueUser,
        redUser,
        redUser,
        blueUser,
        blueUser,
        redUser,
      ];
      const picksPhase2 = [redUser, blueUser, blueUser, redUser];
      const bansArray: Array<string> = [];
      // Runs ban phase while total bans is less than 6
      const handleTurn = (currentSide: string) => {
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
              const chosenChamp = "nothing";
              io.to(lobbyCode).emit("setBan", { chosenChamp });
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
          socket.once("ban", ({ sideCode, chosenChamp }) => {
            console.log(`received ban from ${sideCode} with ${chosenChamp}`);
            banListener({ sideCode, chosenChamp });
          });
  
          io.to(lobbyCode).emit("banTurn", currentSide);
        });
      };
  
      const startBanPhase = async () => {
        console.log("Ban Phase Starting");
        // Tells client ban phase has begun then runs first ban phase
        io.to(lobbyCode).emit("banPhase", true);
        banPhaseStart = true;
        for (const currentSide of bansPhase1) {
          try {
            console.log("currentTurn: ", currentSide);
            io.to(lobbyCode).emit("currentTurn", currentSide);
            await handleTurn(currentSide);
            console.log("switching turns");
          } catch (err) {
            console.error(err);
          } finally {
            socket.removeAllListeners("ban");
            console.log("removed all details listeners");
          }
        }
        console.log("Ban Phase 1 is complete :)");
      };
      await startBanPhase();
    } catch (err) {
      console.error(err);
    }
  };
  