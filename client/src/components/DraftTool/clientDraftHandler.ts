import React from "react";
import { Socket } from "socket.io-client";
import { DraftStateProps } from "./DraftPage";

export const handleBanPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  sideCode: string | undefined,
  socket: Socket,
  setBannedChampions: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps
) => {
  // Reconnection/Late connection logic

  socket.on("currentBanTurn", (currentTurn) => {
    if (currentTurn === sideCode) {
      console.log("Your Turn");
    } else {
      console.log("Enemy Turn");
    }
  });

  let banTimer = 30;
  const timeHandler = (timer: number) => {
    console.log(timer);
    banTimer = timer - 4;
    if (banTimer < 0) {
      banTimer = 0;
    }
    setCurrentTime(banTimer);
  };

  const addBannedChampion = (bannedChampion: string) => {
    setBannedChampions((prevChampions) => [...prevChampions, bannedChampion]);
    console.log("banned Champion: ", bannedChampion);
  };

  const setBanSocket = ({ bannedChampion }: { bannedChampion: string }) => {
    console.log(`Ban received: ${bannedChampion}`);
    addBannedChampion(bannedChampion);
  };
  socket.on("setBan", setBanSocket);
  socket.on("timer", timeHandler);
  socket.once("endBanPhase", () => {
    console.log("BAN phase is over");
    socket.off("setBan", setBanSocket);
    socket.off("timer", timeHandler);
  });
};

export const handlePickPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  sideCode: string | undefined,
  socket: Socket,
  setPickedChampions: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps
) => {
  socket.on("currentPickTurn", (currentTurn) => {
    if (currentTurn === sideCode) {
      console.log("Your Turn");
    } else {
      console.log("Enemy Turn");
    }
  });

  let pickTimer = 30;
  const timeHandler = (timer: number) => {
    pickTimer = timer - 4;
    if (pickTimer < 0) {
      pickTimer = 0;
    }
    setCurrentTime(pickTimer);
  };

  const addBannedChampion = (pickedChampion: string) => {
    setPickedChampions((prevChampions) => [...prevChampions, pickedChampion]);
    console.log("picked Champion: ", pickedChampion);
  };

  const setPickSocket = ({ pickedChampion }: { pickedChampion: string }) => {
    console.log(`Ban received: ${pickedChampion}`);
    addBannedChampion(pickedChampion);
  };
  socket.on("setPick", setPickSocket);
  socket.on("timer", timeHandler);

  socket.once("endPickPhase", () => {
    console.log("PICK phase is over");
    socket.off("setPick", setPickSocket);
    socket.off("timer", timeHandler);
  });
};
