import React from "react";
import { Socket } from "socket.io-client";
import { DraftProps, DraftStateProps } from "./draftInterfaces";

export const handleBanPhase = (
  socket: Socket,
  serverDraftState: DraftStateProps,
  clientDraftState: DraftProps,
  setDraftState: React.Dispatch<React.SetStateAction<DraftProps>>
) => {
  let banTimer = 30;

  // Reconnection/Late connection timer logic
  banTimer = Math.max(serverDraftState.timer - 4, 0);
  setDraftState((prevState) => ({
    ...prevState,
    timer: banTimer,
  }));

  // Timer hides 4 seconds from user to match other drafting tools
  const timeHandler = (timer: number) => {
    banTimer = Math.max(timer - 4, 0);
    setDraftState((prevState) => ({
      ...prevState,
      timer: banTimer,
    }));
  };

  // Ban champion based on side
  const addBannedChampion = (side: string, bannedChampion: string) => {
    if (side === "blue") {
      setDraftState((prevState) => ({
        ...prevState,
        blueBans: [...prevState.blueBans, bannedChampion],
      }));
    } else if (side === "red") {
      setDraftState((prevState) => ({
        ...prevState,
        redBans: [...prevState.redBans, bannedChampion],
      }));
    }
  };

  // Run function to display bans
  const setBanSocket = (state: DraftProps) => {
    setDraftState((prevState) => ({
      ...prevState,
      ...state,
    }));
    let bannedChampion: string = "";
    if (state.displayTurn === "blue") {
      bannedChampion = state.bluePick;
    } else if (state.displayTurn === "red") {
      bannedChampion = state.redPick;
    } else {
      return;
    }

    // Check if champion was already picked or banned (Should never have to since to but just in case)
    if (
      clientDraftState.blueBans.includes(bannedChampion) ||
      clientDraftState.redBans.includes(bannedChampion)
    ) {
      return;
    }
    addBannedChampion(state.displayTurn, bannedChampion);
  };

  // set listeners
  socket.on("setBan", setBanSocket);
  socket.on("timer", timeHandler);

  // Remove listeners at the end of ban phase
  socket.once("endBanPhase", () => {
    socket.off("setBan", setBanSocket);
    socket.off("timer", timeHandler);
  });
};

export const handlePickPhase = (
  socket: Socket,
  serverDraftState: DraftStateProps,
  clientDraftState: DraftProps,
  setDraftState: React.Dispatch<React.SetStateAction<DraftProps>>
) => {
  let pickTimer = 30;

  // Reconnection/Late connection timer logic
  pickTimer = Math.max(serverDraftState.timer - 4, 0);
  setDraftState((prevState) => ({
    ...prevState,
    timer: pickTimer,
  }));

  // Timer hides 4 seconds from user to match other drafting tools
  const timeHandler = (timer: number) => {
    pickTimer = Math.max(timer - 4, 0);
    setDraftState((prevState) => ({
      ...prevState,
      timer: pickTimer,
    }));
  };

  // Pick champion based on side
  const addPickedChampions = (side: string, state: DraftStateProps) => {
    const pickedChampion = side === "blue" ? state.bluePick : state.redPick;
    if (side === "blue") {
      setDraftState((prevState) => ({
        ...prevState,
        bluePicks: [...prevState.bluePicks, pickedChampion],
      }));
    } else if (side === "red") {
      setDraftState((prevState) => ({
        ...prevState,
        redPicks: [...prevState.redPicks, pickedChampion],
      }));
    }
  };

  // Run function to display picks
  const setPickSocket = (state: DraftStateProps) => {
    setDraftState((prevState) => ({
      ...prevState,
      ...state,
    }));
    let pickedChampion: string = "";
    if (state.displayTurn === "blue") {
      pickedChampion = state.bluePick;
    } else if (state.displayTurn === "red") {
      pickedChampion = state.redPick;
    } else {
      return;
    }

    // Check if champion was already picked or banned (Should never have to since to but just in case)
    if (
      clientDraftState.bluePicks.includes(pickedChampion) ||
      clientDraftState.redPicks.includes(pickedChampion)
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
    socket.off("setPick", setPickSocket);
    socket.off("timer", timeHandler);
  });
};
