import { createContext, useContext, useEffect } from "react";
import { FearlessStateProps } from "../interfaces/draftInterfaces";
import { Socket } from "socket.io-client";
import { Outlet } from "react-router-dom";
import { useSessionStorageState } from "../../../hooks/useSessionStorageState";

export interface FearlessContextProps {
  fearlessState: FearlessStateProps | undefined;
  setFearlessState: React.Dispatch<
    React.SetStateAction<FearlessStateProps | undefined>
  >;
}

export interface FearlessSocketContextProps {
  fearlessSocket: Socket | null;
  setFearlessSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const FearlessStateContext = createContext<FearlessContextProps | undefined>(
  undefined
);
const FearlessSocketContext = createContext<
  FearlessSocketContextProps | undefined
>(undefined);

export const FearlessProvider: React.FC = () => {
  const [fearlessSocket, setFearlessSocket] =
    useSessionStorageState<Socket | null>("fearlessSocket", null);
  const [fearlessState, setFearlessState] = useSessionStorageState<
    FearlessStateProps | undefined
  >("fearlessState", undefined);

  useEffect(() => {
    if (!fearlessSocket) return;

    const updateFearlessState = (newState: FearlessStateProps) => {
      setFearlessState((prevState) => ({
        ...prevState,
        ...newState,
      }));
    };
    fearlessSocket.on("newFearlessState", updateFearlessState);
  }, [fearlessSocket]);
  return (
    <FearlessSocketContext.Provider
      value={{ fearlessSocket, setFearlessSocket }}
    >
      <FearlessStateContext.Provider
        value={{ fearlessState, setFearlessState }}
      >
        <Outlet />
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
