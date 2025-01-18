import { Socket } from "socket.io-client";

export const handleBanPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  sideCode: string | undefined,
  socket: Socket,
  setBannedChampions: React.Dispatch<React.SetStateAction<string[]>>
) => {
  socket.on("currentBanTurn", (currentTurn) => {
    if (currentTurn === sideCode) {
      console.log("Your Turn");
    } else {
      console.log("Enemy Turn");
    }
  });
  
  let banTimer = 30;
  socket.on("timer", (timer: number) => {
    banTimer = timer - 4;
    if (banTimer < 0) {
      banTimer = 0;
    }
    setCurrentTime(banTimer);
  });

  const addBannedChampion = (bannedChampion: string) => {
    setBannedChampions((prevChampions) => [...prevChampions, bannedChampion]);
    console.log("banned Champion: ", bannedChampion);
  };

  socket.on("setBan", ({ bannedChampion }) => {
    console.log(`Ban received: ${bannedChampion}`);
    addBannedChampion(bannedChampion);
  });
};

export const handlePickPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  sideCode: string | undefined,
  socket: Socket,
  setPickedChampions: React.Dispatch<React.SetStateAction<string[]>>
) => {
  socket.on("currentPickTurn", (currentTurn) => {
    if (currentTurn === sideCode) {
      console.log("Your Turn");
    } else {
      console.log("Enemy Turn");
    }
  });

  let pickTimer = 30;
  socket.on("timer", (timer: number) => {
    pickTimer = timer - 4;
    if (pickTimer < 0) {
      pickTimer = 0;
    }
    setCurrentTime(pickTimer);
  });

  const addBannedChampion = (pickedChampion: string) => {
    setPickedChampions((prevChampions) => [...prevChampions, pickedChampion]);
    console.log("picked Champion: ", pickedChampion);
  };

  socket.on("setPick", ({ pickedChampion }) => {
    console.log(`Ban received: ${pickedChampion}`);
    addBannedChampion(pickedChampion);
  });
};
