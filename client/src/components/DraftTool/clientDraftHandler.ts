import React from "react";
import { Socket } from "socket.io-client";
import { DraftStateProps } from "./draftInterfaces";

export const handleBanPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  socket: Socket,
  blueBans: string[],
  redBans: string[],
  setBlueBans: React.Dispatch<React.SetStateAction<string[]>>,
  setRedBans: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps,
  setDraftState: React.Dispatch<
    React.SetStateAction<DraftStateProps | undefined>
  >
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
    console.log("You are banning: ", side, " ", bannedChampion);
    if (side === "blue") {
      setBlueBans((prevChampions) => [...prevChampions, bannedChampion]);
    } else if (side === "red") {
      setRedBans((prevChampions) => [...prevChampions, bannedChampion]);
    }
    console.log("banned Champion: ", bannedChampion);
  };

  // Run function to display bans
  const setBanSocket = (state: DraftStateProps) => {
    setDraftState(state);
    let bannedChampion: string = "";
    if (state.displayTurn === "blue") {
      bannedChampion = state.bluePick;
    } else if (state.displayTurn === "red") {
      bannedChampion = state.redPick;
    } else {
      return;
    }
    console.log(`Ban received: ${bannedChampion}`);

    // Check if champion was already picked or banned (Should never have to since to but just in case)
    if (blueBans.includes(bannedChampion) || redBans.includes(bannedChampion)) {
      return;
    }
    addBannedChampion(state.displayTurn, bannedChampion);
  };

  // set listeners
  socket.on("setBan", setBanSocket);
  socket.on("timer", timeHandler);

  // Remove listeners at the end of ban phase
  socket.once("endBanPhase", () => {
    console.log("BAN phase is over");
    socket.off("setBan", setBanSocket);
    socket.off("timer", timeHandler);
  });
};

export const handlePickPhase = (
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  socket: Socket,
  bluePicks: string[],
  redPicks: string[],
  setBluePicks: React.Dispatch<React.SetStateAction<string[]>>,
  setRedPicks: React.Dispatch<React.SetStateAction<string[]>>,
  draftState: DraftStateProps,
  setDraftState: React.Dispatch<
    React.SetStateAction<DraftStateProps | undefined>
  >
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

  // Pick champion based on side
  const addPickedChampions = (side: string, state: DraftStateProps) => {
    const pickedChampion = side === 'blue' ? state.bluePick : state.redPick
    console.log("You are picking: ", side, " ", pickedChampion);
    if (side === "blue") {
      setBluePicks(state.bluePicks);
    } else if (side === "red") {
      setRedPicks(state.redPicks);
    }
    console.log("picked Champion: ", pickedChampion);
  };

  // Run function to display picks
  const setPickSocket = (state: DraftStateProps) => {
    setDraftState(state);
    let pickedChampion: string = "";
    if (state.displayTurn === "blue") {
      pickedChampion = state.bluePick;
    } else if (state.displayTurn === "red") {
      pickedChampion = state.redPick;
    } else {
      return;
    }
    console.log(`Pick received: ${pickedChampion}`);

    // Check if champion was already picked or banned (Should never have to since to but just in case)
    if (
      bluePicks.includes(pickedChampion) ||
      redPicks.includes(pickedChampion)
    ) {
      return;
    }
    addPickedChampions(state.displayTurn, state);
  };

  // Set listeners
  socket.on("setPick", setPickSocket);
  socket.on("timer", timeHandler);

  // remove listeners at the end of pick phase
  socket.once("endPickPhase", () => {
    console.log("PICK phase is over");
    socket.off("setPick", setPickSocket);
    socket.off("timer", timeHandler);
  });
};
