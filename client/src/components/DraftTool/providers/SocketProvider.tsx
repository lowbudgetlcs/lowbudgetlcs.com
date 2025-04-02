import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { getClientId } from "../../../utils/clientId";
import { Outlet } from "react-router-dom";

interface SocketContextProps {
  createSocket: (namespace: string) => Socket;
  disconnectSocket: (socket: Socket) => void;
  clientId: string;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC = () => {
  const [activeSocketMap] = useState<Map<Socket, string>>(new Map());
  const clientId = getClientId();
  
  // create a new socket with the client ID
  const createSocket = (namespace: string): Socket => {
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}${namespace}`, {
      query: { clientId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    activeSocketMap.set(newSocket, namespace);
    return newSocket;
  };
  
  // Disconnects socket
  const disconnectSocket = (socket: Socket) => {
    if (socket && activeSocketMap.has(socket)) {
      socket.disconnect();
      activeSocketMap.delete(socket);
    }
  };
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      activeSocketMap.forEach((_, socket) => {
        socket.disconnect();
      });
    };
  }, []);

  return (
    <SocketContext.Provider value={{ createSocket, disconnectSocket, clientId }}>
      <Outlet/>
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};