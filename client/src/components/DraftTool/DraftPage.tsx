import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { connectionHandler } from "./draftHandler";
import { Link, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "./clientDraftHandler";

import championsData from "./championRoles.json";
import { Champion, DraftProps, DraftStateProps } from "./draftInterfaces";
import DraftDisplay from "./DraftDisplay";
import Button from "../Button";
import { pastDraftHandler, PastLobbyProps } from "./pastDraftHandler";
import { defaultDraftState } from "./defaultDraftState";

export interface SocketContextProps {
  socket: Socket | null;
}
const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContext Provider"
    );
  }
  return context;
};

function DraftPage() {
  const [draftState, setDraftState] = useState<DraftProps>(defaultDraftState);
  const [isPastDraft, setIsPastDraft] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [championRoles, setChampionRoles] = useState<Champion[]>([]);
  const [playerSide, setPlayerSide] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  const initialConnection = () => {
    setLoading(true);

    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    // Run connection Handler Function with lobby code
    const startConnection = () => {
      connectionHandler(
        newSocket,
        lobbyCode,
        sideCode,
        setDraftState,
        setPlayerSide,
        setError
      );
    };
    newSocket.on("connect", startConnection);
    setLoading(false);
  };

  useLayoutEffect(() => {
    if (!lobbyCode) {
      setError(true);
      setLoading(false);
      return;
    }
    // Checks if a draft has already happened and is in the database
    // If it is, displays draft results without using websockets
    const checkPastDraft = async () => {
      try {
        const pastDraft: PastLobbyProps | undefined = await pastDraftHandler(
          lobbyCode
        );
        if (!pastDraft) {
          setError(true);
          console.error("Unexpected error finding past drafts");
          return;
        } else if (pastDraft.isValid && pastDraft.draftState) {
          setDraftState(pastDraft.draftState);
          setIsPastDraft(true);
          return;
        } else {
          initialConnection();
        }
      } catch (err) {
        setError(true);
        console.error("Error finding draft: ", err);
      }
    };
    // Yes this has to be here
    setChampionRoles(championsData);
    checkPastDraft();
  }, []);

  // Might be rudundant with state changes
  useEffect(() => {
    if (!socket) {
      return;
    }
    const startReconnection = (state: DraftStateProps) => {
      setLoading(true);
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
      if (state.phaseType === "pick") {
        handlePickPhase(socket, state, draftState, setDraftState);
      } else if (state.phaseType === "ban") {
        handleBanPhase(socket, state, draftState, setDraftState);
      }
    };
    socket.on("state", startReconnection);
    setLoading(false);
    return () => {
      socket.off("state", startReconnection);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !draftState) {
      return;
    }
    const startBanPhase = (state: DraftStateProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handleBanPhase(socket, state, draftState, setDraftState);
    };

    const startPickPhase = (state: DraftStateProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handlePickPhase(socket, state, draftState, setDraftState);
    };

    const endDraft = (state: DraftStateProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
    };

    // Listening for beginning of phases
    socket.on("banPhase", startBanPhase);
    socket.on("pickPhase", startPickPhase);
    socket.once("draftComplete", endDraft);

    return () => {
      socket.off("banPhase", startBanPhase);
      socket.off("pickPhase", startPickPhase);
      socket.off("draftComplete", endDraft);
    };
  }, [socket, draftState.activePhase]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleCurrentTurn = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
    };
    socket.on("currentTurn", handleCurrentTurn);

    return () => {
      socket.off("currentTurn", handleCurrentTurn);
    };
  }, [socket]);

  if (draftState && lobbyCode && (socket || isPastDraft) && !error) {
    return (
      <SocketContext.Provider value={{ socket }}>
        <DraftDisplay
          draftState={draftState}
          lobbyCode={lobbyCode}
          sideCode={sideCode}
          championRoles={championRoles}
          playerSide={playerSide}
        />
      </SocketContext.Provider>
    );
  } else if (loading) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
        <p>Loading Draft</p>
        <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
      </div>
    );
  } else if (error) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-6xl font-bold">Draft Not Found</p>
        <p className="text-red">
          Some error has occured. Check your URL or click the button below!
        </p>
        <div className="cursor-pointer">
          <Link to={"/draft"}>
            <Button>Back to Draft Creation</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default DraftPage;
