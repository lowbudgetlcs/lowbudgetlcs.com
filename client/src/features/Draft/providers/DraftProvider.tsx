// client/src/components/DraftTool/providers/DraftInstanceProvider.tsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { Champion, DraftProps } from "../interfaces/draftInterfaces";
import { defaultDraftState } from "../data/defaultDraftState";
import { handleBanPhase, handlePickPhase } from "../socket/clientDraftHandler";
import { useSocketContext } from "./SocketProvider";
import { Outlet } from "react-router-dom";
import { pastDraftHandler, PastLobbyProps } from "../api/pastDraftHandler";
import { useQuery } from "@tanstack/react-query";
import getChampionData from "../api/getChampionData";

interface DraftContextProps {
  draftState: DraftProps;
  setDraftState: React.Dispatch<React.SetStateAction<DraftProps>>;
  draftSocket: Socket | null;
  playerSide: string;
  setPlayerSide: React.Dispatch<React.SetStateAction<string>>;
  isPastDraft: boolean;
  setIsPastDraft: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: boolean;
  chosenChamp: string | undefined;
  setChosenChamp: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentHover: string | null;
  setCurrentHover: React.Dispatch<React.SetStateAction<string | null>>;
  initializeDraft: (lobbyCode: string, sideCode?: string) => Promise<void>;
  readyHandler: (ready: boolean) => void;
  pickHandler: (championName: string, isPickPhase: boolean, isBanPhase: boolean) => void;
  championList: Champion[];
}

const DraftContext = createContext<DraftContextProps | undefined>(undefined);

export const DraftProvider: React.FC = () => {
  // Core state
  const [draftState, setDraftState] = useState<DraftProps>(defaultDraftState);
  const [draftSocket, setDraftSocket] = useState<Socket | null>(null);
  const [playerSide, setPlayerSide] = useState<string>("");
  const [isPastDraft, setIsPastDraft] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [championList, setChampionList] = useState<Champion[]>([]);

  // UI states
  const [chosenChamp, setChosenChamp] = useState<string | undefined>();
  const [currentHover, setCurrentHover] = useState<string | null>(null);

  const isInitializing = useRef(false);
  const currentLobbyCode = useRef<string | null>(null);
  const connectionAttempts = useRef(0);

  // Socket context
  const { createSocket, disconnectSocket, clientId } = useSocketContext();

  const championQuery = useQuery({
    queryKey: ["championList"],
    queryFn: () => getChampionData(),
  });

  useEffect(() => {
    if (championQuery.data) {
      setChampionList(championQuery.data);
    }
  }, [championQuery.data]);
  
  const initializeDraft = async (lobbyCode: string, sideCode?: string) => {
    if (isInitializing.current || currentLobbyCode.current === lobbyCode) {
      return;
    }

    isInitializing.current = true;
    currentLobbyCode.current = lobbyCode;
    setLoading(true);
    setError(false);
    try {
      // Check if this is a past draft first
      const pastDraft: PastLobbyProps | undefined = await pastDraftHandler(lobbyCode);

      if (pastDraft && pastDraft.isValid && pastDraft.draftState) {
        // If it is a completed draft, just load the state
        setDraftState(pastDraft.draftState);
        setIsPastDraft(true);
        setLoading(false);
        return;
      }

      // If not a past draft, connects to server socket
      if (draftSocket) {
        disconnectSocket(draftSocket);
      }

      // Limit connection Attempts (if looping occurs)
      if (connectionAttempts.current > 3) {
        console.error("Too many connection attempts, aborting");
        setError(true);
        setLoading(false);
        isInitializing.current = false;
        return;
      }
      connectionAttempts.current++;

      const newSocket = createSocket("/draft");
      setDraftSocket(newSocket);

      // Store draft info for reconnection
      sessionStorage.setItem("activeLobbyCode", lobbyCode);
      if (sideCode) {
        sessionStorage.setItem("activeSideCode", sideCode);
      }

      // connection handlers
      const connectionPromise = new Promise<void>((resolve, reject) => {
        // Successful connection handler
        const handleJoined = ({ sideDisplay }: { sideDisplay: string }) => {
          setPlayerSide(sideDisplay);
          isInitializing.current = false;
          connectionAttempts.current = 0;
          resolve();
        };

        // Error handler
        const handleError = (err: unknown) => {
          console.error("Socket error:", err);
          setError(true);
          isInitializing.current = false;
          reject(new Error("Failed to join draft"));
        };

        // Add event listeners
        newSocket.once("joinedDraft", handleJoined);
        newSocket.once("error", handleError);

        // Attempt to join the draft
        newSocket.emit("joinDraft", { lobbyCode, sideCode, clientId });

        // Timeout for joining
        setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 10000);
      });

      await connectionPromise;
    } catch (err) {
      console.error("Error initializing draft:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle readying
  const readyHandler = (ready: boolean) => {
    if (!draftSocket) return;

    const lobbyCode = sessionStorage.getItem("activeLobbyCode");
    const sideCode = sessionStorage.getItem("activeSideCode");

    if (!lobbyCode || !sideCode) {
      console.error("Missing lobby or side code");
      return;
    }

    draftSocket.emit("ready", { lobbyCode, sideCode, ready });
  };

  // Handle pick/ban
  const pickHandler = (championName: string, isPickPhase: boolean, isBanPhase: boolean) => {
    if (!draftSocket) return;

    const lobbyCode = sessionStorage.getItem("activeLobbyCode");
    const sideCode = sessionStorage.getItem("activeSideCode");

    if (!lobbyCode || !sideCode) {
      console.error("Missing lobby or side code");
      return;
    }

    if (isBanPhase) {
      draftSocket.emit("ban", { lobbyCode, sideCode, chosenChamp: championName });
    }

    if (isPickPhase) {
      draftSocket.emit("pick", { lobbyCode, sideCode, chosenChamp: championName });
    }
  };

  // Socket event listeners for draft state updates
  useEffect(() => {
    if (!draftSocket) return;

    // Core state update handler
    const handleStateUpdate = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
    };

    // Champion hover handler
    const handleHover = (state: DraftProps) => {
      if (state.currentHover) {
        setChosenChamp(state.currentHover);
      }
      setCurrentHover(state.currentHover);
    };

    // Phase handlers
    const startBanPhase = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handleBanPhase(draftSocket, state, setDraftState);
    };

    const handleCurrentTurn = (state: DraftProps) => {
      setDraftState((prevState) => {
        const { timer, ...rest } = prevState;
        return {
          ...rest,
          ...state,
          timer: 30,
        };
      });
    };

    const startPickPhase = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handlePickPhase(draftSocket, state, setDraftState);
    };
    const handleTimerUpdate = (timer: number) => {
      const fixedTimer = Math.max(timer - 4, 0);
      setDraftState((prevState) => ({
        ...prevState,
        timer: fixedTimer,
      }));
    };

    // All the beautiful socket event listeners
    draftSocket.on("state", handleStateUpdate);
    draftSocket.on("currentTurn", handleCurrentTurn);
    draftSocket.on("banHover", handleHover);
    draftSocket.on("pickHover", handleHover);
    draftSocket.on("banPhase", startBanPhase);
    draftSocket.on("pickPhase", startPickPhase);
    draftSocket.on("draftComplete", handleStateUpdate);
    draftSocket.on("blueReady", handleStateUpdate);
    draftSocket.on("redReady", handleStateUpdate);
    draftSocket.on("setPick", handleStateUpdate);
    draftSocket.on("setBan", handleStateUpdate);
    draftSocket.on("timer", handleTimerUpdate);

    // Clean up every. event. listener.
    return () => {
      draftSocket.off("state", handleStateUpdate);
      draftSocket.off("currentTurn", handleCurrentTurn);
      draftSocket.off("banHover", handleHover);
      draftSocket.off("pickHover", handleHover);
      draftSocket.off("banPhase", startBanPhase);
      draftSocket.off("pickPhase", startPickPhase);
      draftSocket.off("draftComplete", handleStateUpdate);
      draftSocket.off("blueReady", handleStateUpdate);
      draftSocket.off("redReady", handleStateUpdate);
      draftSocket.off("setPick", handleStateUpdate);
      draftSocket.off("setBan", handleStateUpdate);
      draftSocket.off("timer", handleTimerUpdate);
    };
  }, [draftSocket]);

  // Effect to send champion hover updates to server
  // Then gets sent from server to clients
  useEffect(() => {
    if (!draftSocket || !chosenChamp) return;

    const lobbyCode = sessionStorage.getItem("activeLobbyCode");
    const sideCode = sessionStorage.getItem("activeSideCode");

    if (!lobbyCode || !sideCode) return;

    if (draftState.displayTurn !== playerSide) {
      setChosenChamp(undefined);
      return;
    }

    draftSocket.emit("clientHover", { chosenChamp, lobbyCode, sideCode });
  }, [chosenChamp, draftState.displayTurn, playerSide, draftSocket]);

  // Clean up hover state on phase change
  useEffect(() => {
    setCurrentHover(null);
  }, [draftState.activePhase, draftState.displayTurn]);

  // Clean up on unmount or when leaving a draft
  useEffect(() => {
    return () => {
      if (draftSocket) {
        disconnectSocket(draftSocket);
        setDraftSocket(null);
      }
    };
  }, [draftSocket, disconnectSocket]);

  return (
    <DraftContext.Provider
      value={{
        draftState,
        setDraftState,
        draftSocket,
        playerSide,
        setPlayerSide,
        isPastDraft,
        setIsPastDraft,
        loading,
        error,
        chosenChamp,
        setChosenChamp,
        currentHover,
        setCurrentHover,
        initializeDraft,
        readyHandler,
        pickHandler,
        championList,
      }}>
      <Outlet />
    </DraftContext.Provider>
  );
};

export const useDraftContext = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraftContext must be used within a DraftProvider");
  }
  return context;
};
