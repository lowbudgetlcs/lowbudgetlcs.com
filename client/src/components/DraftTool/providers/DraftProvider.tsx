import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";

export interface SocketContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

export interface PastDraftContextProps {
  isPastDraft: boolean | null;
  setIsPastDraft: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);
const PastDraftContext = createContext<PastDraftContextProps | undefined>(
  undefined
);

export const DraftContextProvider: React.FC = () => {
  const [isPastDraft, setIsPastDraft] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <PastDraftContext.Provider value={{ isPastDraft, setIsPastDraft }}>
        <Outlet />
      </PastDraftContext.Provider>
    </SocketContext.Provider>
  );
};
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContext Provider"
    );
  }
  return context;
};

export const usePastDraftContext = () => {
  const context = useContext(PastDraftContext);
  if (!context) {
    throw new Error(
      "usePastDraftContext must be used within a SocketContext Provider"
    );
  }
  return context;
};
