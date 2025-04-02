import { createContext, useContext, useEffect, useState } from "react";
import { FearlessStateProps } from "../interfaces/draftInterfaces";
import { Socket } from "socket.io-client";
import { Outlet } from "react-router-dom";
import { useSocketContext } from "./SocketProvider";

export interface FearlessContextProps {
  fearlessState: FearlessStateProps | undefined;
  setFearlessState: React.Dispatch<
    React.SetStateAction<FearlessStateProps | undefined>
  >;
  fearlessSocket: Socket | null;
  initializeFearlessSocket: (fearlessCode: string) => void;
}

const FearlessContext = createContext<FearlessContextProps | undefined>(
  undefined
);

export const FearlessProvider: React.FC = () => {
  const [fearlessSocket, setFearlessSocket] = useState<Socket | null>(null);
  const [fearlessState, setFearlessState] = useState<
    FearlessStateProps | undefined
  >(undefined);
  const { createSocket, disconnectSocket, clientId } = useSocketContext();

  // Initialize fearless socket
  const initializeFearlessSocket = (fearlessCode: string) => {
    if (fearlessSocket) {
      disconnectSocket(fearlessSocket);
    }

    const newSocket = createSocket("/fearless");
    setFearlessSocket(newSocket);

    // Store the fearless code in session storage
    sessionStorage.setItem("activeFearlessCode", fearlessCode);

    newSocket.emit("joinFearless", { fearlessCode, clientId });
  };

  // Update fearless state
  useEffect(() => {
    if (!fearlessSocket) return;

    const updateFearlessState = (newState: FearlessStateProps) => {
      setFearlessState((prevState) => ({
        ...prevState,
        ...newState,
      }));
    };

    fearlessSocket.on("fearlessState", updateFearlessState);
    fearlessSocket.on("newFearlessState", updateFearlessState);

    return () => {
      fearlessSocket.off("fearlessState", updateFearlessState);
      fearlessSocket.off("newFearlessState", updateFearlessState);
    };
  }, [fearlessSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fearlessSocket) {
        disconnectSocket(fearlessSocket);
      }
    };
  }, []);

  return (
    <FearlessContext.Provider
      value={{
        fearlessState,
        setFearlessState,
        fearlessSocket,
        initializeFearlessSocket,
      }}
    >
      <Outlet />
    </FearlessContext.Provider>
  );
};

export const useFearlessContext = () => {
  const context = useContext(FearlessContext);
  if (!context) {
    throw new Error(
      "useFearlessContext must be used within a FearlessProvider"
    );
  }
  return context;
};
