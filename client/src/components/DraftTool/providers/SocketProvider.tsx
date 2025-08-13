import { createContext, useCallback, useContext, useState } from "react";
import { Socket, io } from "socket.io-client";
import { getClientId } from "../../../utils/clientId";
import { Outlet } from "react-router-dom";

interface SocketContextProps {
  createSocket: (namespace: string) => Socket;
  disconnectSocket: (socket: Socket) => void;
  clientId: string;
  // Popups
  showConnectedPopup: boolean;
  setShowConnectedPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showReconnectPopup: boolean;
  setShowReconnectPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showErrorPopup: boolean;
  setShowErrorPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC = () => {
  const [activeSocketMap] = useState<Map<Socket, string>>(new Map());
  const [showReconnectPopup, setShowReconnectPopup] = useState<boolean>(false);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [showConnectedPopup, setShowConnectedPopup] = useState<boolean>(false);

  const clientId = getClientId();

  // create a new socket with the client ID
  const createSocket = useCallback(
    (namespace: string): Socket => {
      const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}${namespace}`, {
        query: { clientId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const onConnect = () => {
        console.log(`Socket connected to ${namespace}`);
        setShowConnectedPopup(true);
        setShowReconnectPopup(false);
        setShowErrorPopup(false);
      };
      const onDisconnect = (reason: Socket.DisconnectReason) => {
        console.log(`Socket disconnected from ${namespace}. Reason: ${reason}`);
        setShowConnectedPopup(false);

        if (
          reason === "io server disconnect" ||
          reason === "transport close" ||
          reason === "ping timeout"
        ) {
          setShowReconnectPopup(true);
        } else if (reason !== "io client disconnect") {
          setShowReconnectPopup(false);
          setShowErrorPopup(true);
        }
      };

      const onReconnectAttempt = () => {
        console.log("Reconnection attempt in progress...");
        setShowReconnectPopup(true);
      };
      const onReconnectError = (error: Error) => {
        console.error("Reconnection error:", error);
      };
      const onReconnectFailed = () => {
        console.log("All reconnection attempts failed. Please restart the application.");
        setShowReconnectPopup(false);
        setShowErrorPopup(true);
      };
      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
      newSocket.on("reconnect_attempt", onReconnectAttempt);
      newSocket.on("reconnect_error", onReconnectError);
      newSocket.on("reconnect_failed", onReconnectFailed);
      newSocket.on("connect_error", onReconnectFailed);

      newSocket.on("reconnect_attempt", () => {
        console.log(`Socket reconnecting to ${namespace}`);
        setShowReconnectPopup(true);
      });
      activeSocketMap.set(newSocket, namespace);
      return newSocket;
    },
    [clientId]
  );

  // Disconnects socket
  const disconnectSocket = useCallback((socket: Socket) => {
    if (socket && activeSocketMap.has(socket)) {
      socket.disconnect();
      activeSocketMap.delete(socket);
    }
  }, []);
  return (
    <SocketContext.Provider
      value={{
        createSocket,
        disconnectSocket,
        clientId,
        showConnectedPopup,
        setShowConnectedPopup,
        showReconnectPopup,
        setShowReconnectPopup,
        showErrorPopup,
        setShowErrorPopup,
      }}>
      <Outlet />
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
