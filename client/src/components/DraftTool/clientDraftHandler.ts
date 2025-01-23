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
  let banTimer = 30;

  // Reconnection/Late connection timer logic
  banTimer = Math.max(draftState.timer - 4, 0)
  setCurrentTime(banTimer);
  
  const timeHandler = (timer: number) => {
    banTimer = Math.max(timer - 4, 0);
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
  let pickTimer = 30;

  // Reconnection/Late connection timer logic
  pickTimer = Math.max(draftState.timer - 4, 0)
  setCurrentTime(pickTimer);

  const timeHandler = (timer: number) => {
    pickTimer = Math.max(timer - 4, 0);
    setCurrentTime(pickTimer);
  };

  const addPickedChampions = (pickedChampion: string) => {
    setPickedChampions((prevChampions) => [...prevChampions, pickedChampion]);
    console.log("picked Champion: ", pickedChampion);
  };

  const setPickSocket = ({ pickedChampion }: { pickedChampion: string }) => {
    console.log(`Pick received: ${pickedChampion}`);
    addPickedChampions(pickedChampion);
  };
  socket.on("setPick", setPickSocket);
  socket.on("timer", timeHandler);

  socket.once("endPickPhase", () => {
    console.log("PICK phase is over");
    socket.off("setPick", setPickSocket);
    socket.off("timer", timeHandler);
  });
};
