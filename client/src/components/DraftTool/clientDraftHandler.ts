import React from "react";
import { Socket } from "socket.io-client";
import { BanProps, DraftStateProps, PickProps } from "./draftInterfaces";

export const handleBanPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  socket: Socket,
  setBlueBans: React.Dispatch<React.SetStateAction<string[]>>,
  setRedBans: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps
) => {
  let banTimer = 30;

  // Reconnection/Late connection timer logic
  banTimer = Math.max(draftState.timer - 4, 0);
  setCurrentTime(banTimer);

  // Timer hides 4 seconds from user to match other drafting tools
  const timeHandler = (timer: number) => {
    banTimer = Math.max(timer - 4, 0);
    setCurrentTime(banTimer);
  };

  // Ban champion based on side
  const addBannedChampion = (side: string, bannedChampion: string) => {
    if (side === "blue") {
      setBlueBans((prevChampions) => [...prevChampions, bannedChampion]);
    } else if (side === "red") {
      setRedBans((prevChampions) => [...prevChampions, bannedChampion]);
    }
    console.log("banned Champion: ", bannedChampion);
  };

  // Run function to display bans
  const setBanSocket = ({ side, bannedChampion }: BanProps) => {
    console.log(`Ban received: ${bannedChampion}`);
    addBannedChampion(side, bannedChampion);
  };
  // set listeners
  socket.on("setBan", setBanSocket);
  socket.on("timer", timeHandler);
  // Remove listeners
  socket.once("endBanPhase", () => {
    console.log("BAN phase is over");
    socket.off("setBan", setBanSocket);
    socket.off("timer", timeHandler);
  });
};

export const handlePickPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  socket: Socket,
  setBluePicks: React.Dispatch<React.SetStateAction<string[]>>,
  setRedPicks: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps
) => {
  let pickTimer = 30;

  // Reconnection/Late connection timer logic
  pickTimer = Math.max(draftState.timer - 4, 0);
  setCurrentTime(pickTimer);

  // Timer hides 4 seconds from user to match other drafting tools
  const timeHandler = (timer: number) => {
    pickTimer = Math.max(timer - 4, 0);
    setCurrentTime(pickTimer);
  };

  // Ban champion based on side
  const addPickedChampions = (side: string, pickedChampion: string) => {
    if (side === "blue") {
      setBluePicks((prevChampions) => [...prevChampions, pickedChampion]);
    } else if (side === "red") {
      setRedPicks((prevChampions) => [...prevChampions, pickedChampion]);
    }
    console.log("picked Champion: ", pickedChampion);
  };

  // Run function to display picks
  const setPickSocket = ({side, pickedChampion }: PickProps) => {
    console.log(`Pick received: ${pickedChampion}`);
    addPickedChampions(side, pickedChampion);
  };
  socket.on("setPick", setPickSocket);
  socket.on("timer", timeHandler);

  socket.once("endPickPhase", () => {
    console.log("PICK phase is over");
    socket.off("setPick", setPickSocket);
    socket.off("timer", timeHandler);
  });
};
