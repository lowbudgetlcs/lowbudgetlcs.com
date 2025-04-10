import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FearlessStateProps } from "../interfaces/draftInterfaces";
import { Socket } from "socket.io-client";
import { Outlet } from "react-router-dom";
import { useSocketContext } from "./SocketProvider";
import { pastFearlessHandler } from "../draftRunHandlers/pastFearlessHandler";

export interface FearlessContextProps {
  fearlessState: FearlessStateProps | undefined;
  setFearlessState: React.Dispatch<
    React.SetStateAction<FearlessStateProps | undefined>
  >;
  fearlessSocket: Socket | null;
  team: string | undefined;
  loading: boolean;
  error: boolean;
  initializeFearless: (fearlessCode: string, teamCode: string) => void;
  handleSideSelect: (side: "blue" | "red") => void;
  isPastSeries: boolean;
}

const FearlessContext = createContext<FearlessContextProps | undefined>(
  undefined
);

export const FearlessProvider: React.FC = () => {
  const [fearlessSocket, setFearlessSocket] = useState<Socket | null>(null);
  const [fearlessState, setFearlessState] = useState<
    FearlessStateProps | undefined
  >(undefined);
  const [team, setTeam] = useState<string | undefined>();
  const [isPastSeries, setIsPastSeries] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { createSocket, disconnectSocket, clientId } = useSocketContext();

  // Used to track if page is loading/loaded (stop looping pls)
  const isInitializing = useRef(false);
  const currentFearlessCode = useRef<string | null>(null);

  // Initialize fearless socket and state
  const initializeFearless = useCallback(
    async (fearlessCode: string, teamCode: string) => {
      // Prevent multiple initialization attempts for the same code (NO LOOPS)
      if (
        isInitializing.current ||
        currentFearlessCode.current === fearlessCode
      ) {
        return;
      }

      isInitializing.current = true;
      currentFearlessCode.current = fearlessCode;
      setLoading(true);
      setError(false);
      try {
        // Check if this is a past fearless series first
        const pastSeries: FearlessStateProps | undefined =
          await pastFearlessHandler(fearlessCode);

        if (pastSeries && pastSeries.fearlessComplete) {
          // If it is a completed series, just load the state
          setFearlessState(pastSeries);
          setIsPastSeries(true);
          setLoading(false);
          return;
        }
        // Clean up existing socket if it exists.
        if (fearlessSocket) {
          disconnectSocket(fearlessSocket);
        }

        const newSocket = createSocket("/fearless");
        setFearlessSocket(newSocket);

        // Set up handlers for initial connection
        const handleJoined = ({ teamDisplay, fearlessState }: any) => {
          setTeam(teamDisplay);
          setFearlessState(fearlessState);
          setLoading(false);
          isInitializing.current = false;
        };

        const handleError = (err: any) => {
          console.error("Error connecting to fearless:", err);
          setError(true);
          setLoading(false);
          isInitializing.current = false;
        };

        newSocket.on("connect", () => {
          newSocket.emit("joinFearless", { fearlessCode, teamCode, clientId });
        });

        // Establish connection once
        newSocket.once("joinedFearless", handleJoined);
        newSocket.once("error", handleError);
        if (newSocket.connected) {
          console.log("Socket already connected, emitting joinFearless");
          newSocket.emit("joinFearless", { fearlessCode, teamCode, clientId });
        }
      } catch (err) {
        console.error("Error initializing draft:", err);
        setError(true);
      }
    },
    [createSocket, disconnectSocket, clientId]
  );

  // Socket event listeners & state updater
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
    fearlessSocket.on("nextDraft", updateFearlessState);
    fearlessSocket.on("fearlessCompleted", updateFearlessState);
    fearlessSocket.on("sideSelected", updateFearlessState);

    return () => {
      fearlessSocket.off("fearlessState", updateFearlessState);
      fearlessSocket.off("newFearlessState", updateFearlessState);
      fearlessSocket.off("nextDraft", updateFearlessState);
      fearlessSocket.off("fearlessCompleted", updateFearlessState);
      fearlessSocket.off("sideSelected", updateFearlessState);
    };
  }, [fearlessSocket]);

  // Select a side for the draft
  const handleSideSelect = useCallback(
    (side: "blue" | "red") => {
      if (!fearlessSocket || !fearlessState) return;

      fearlessSocket.emit("selectSide", {
        fearlessCode: fearlessState.fearlessCode,
        selectedSide: side,
      });
    },
    [fearlessSocket, fearlessState]
  );

  return (
    <FearlessContext.Provider
      value={{
        fearlessState,
        setFearlessState,
        fearlessSocket,
        team,
        loading,
        error,
        initializeFearless,
        handleSideSelect,
        isPastSeries,
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
