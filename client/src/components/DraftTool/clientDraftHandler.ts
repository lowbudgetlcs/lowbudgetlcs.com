import React from "react";
import { Socket } from "socket.io-client";
import { DraftProps, DraftStateProps } from "./draftInterfaces";

export const handleBanPhase = (
  socket: Socket,
  serverDraftState: DraftStateProps,
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

  // Run function to display bans
  const setBan = (state: DraftProps) => {
    setDraftState((prevState) => ({
      ...prevState,
      ...state,
    }));
  };

  // set listeners
  socket.on("setBan", setBan);
  socket.on("timer", timeHandler);

  // Remove listeners at the end of ban phase
  socket.once("endBanPhase", () => {
    socket.off("setBan", setBan);
    socket.off("timer", timeHandler);
  });
};

export const handlePickPhase = (
  socket: Socket,
  serverDraftState: DraftStateProps,
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

  // Run function to display picks
  const setPick = (state: DraftStateProps) => {
    setDraftState((prevState) => ({
      ...prevState,
      ...state,
    }));
  };

  // Set listeners
  socket.on("setPick", setPick);
  socket.on("timer", timeHandler);

  // remove listeners at the end of pick phase
  socket.once("endPickPhase", () => {
    socket.off("setPick", setPick);
    socket.off("timer", timeHandler);
  });
};
