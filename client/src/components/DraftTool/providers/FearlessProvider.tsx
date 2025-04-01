import { createContext, useContext, useState } from "react";
import { FearlessStateProps } from "../interfaces/draftInterfaces";
import { Socket } from "socket.io-client";
import { Outlet } from "react-router-dom";

export interface FearlessContextProps {
  fearlessState: FearlessStateProps | undefined;
  setFearlessState: React.Dispatch<React.SetStateAction<FearlessStateProps | undefined>>;
}

export interface FearlessSocketContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const FearlessStateContext = createContext<FearlessContextProps | undefined>(undefined);
const FearlessSocketContext = createContext<FearlessSocketContextProps | undefined>(undefined);

export const FearlessProvider: React.FC = ()=> {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [fearlessState, setFearlessState] = useState<FearlessStateProps | undefined>(undefined);
  
  return (
    <FearlessSocketContext.Provider value={{ socket, setSocket }}>
      <FearlessStateContext.Provider value={{ fearlessState, setFearlessState }}>
        <Outlet/>
      </FearlessStateContext.Provider>
    </FearlessSocketContext.Provider>
  );
};

export const useFearlessStateContext = () => {
  const context = useContext(FearlessStateContext);
  if (!context) {
    throw new Error(
      "useFearlessStateContext must be used within a FearlessStateContext Provider"
    );
  }
  return context;
};

export const useFearlessSocketContext = () => {
  const context = useContext(FearlessSocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContext Provider"
    );
  }
  return context;
};