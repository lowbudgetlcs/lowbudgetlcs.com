import { useEffect, useLayoutEffect, useState } from "react";
import { connectionHandler } from "../draftHandler";
import { Link, useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "../clientDraftHandler";

import championsData from "../championRoles.json";
import { Champion, DraftProps } from "../draftInterfaces";
import DraftDisplay from "../DraftDisplay";
import Button from "../../Button";
import { pastDraftHandler, PastLobbyProps } from "../pastDraftHandler";
import { defaultDraftState } from "../defaultDraftState";
import StreamDisplay from "../StreamView/StreamDisplay";
import {
  useFearlessSocketContext,
  useFearlessStateContext,
} from "../providers/FearlessProvider";
import {
  usePastDraftContext,
  useSocketContext,
} from "../providers/DraftProvider";
import { FearlessStateProps } from "../interfaces/draftInterfaces";

function FearlessDraftPage() {
  const [draftState, setDraftState] = useState<DraftProps>(defaultDraftState);
  const { isPastDraft, setIsPastDraft } = usePastDraftContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { socket, setSocket } = useSocketContext();
  const { fearlessSocket } = useFearlessSocketContext();
  const [championRoles, setChampionRoles] = useState<Champion[]>([]);
  const [playerSide, setPlayerSide] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const location = useLocation();

  // Set stream mode
  const streamMode = location.pathname.includes("stream");

  // Set fearless mode
  const fearlessDraft = location.pathname.includes("fearless");

  const { fearlessState, setFearlessState } = useFearlessStateContext();

  // Grab the lobby code
  const params = useParams();
  let lobbyCode: string | undefined = params.lobbyCode;
  let sideCode: string | undefined = params.sideCode;
  const fearlessCode = params.fearlessCode;

  // If it is a fearless draft will get the current draft info from the state
  if (fearlessDraft && fearlessState && fearlessState.currentDraft) {
    lobbyCode = fearlessState.currentDraft;
    sideCode = params.teamCode;
  }

  // Check if "stream" is found in the browser to enable stream mode
  const initialConnection = () => {
    setLoading(true);

    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}/draft`);
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
    const startReconnection = (state: DraftProps) => {
      setLoading(true);
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
      if (state.phaseType === "pick") {
        handlePickPhase(socket, state, setDraftState);
      } else if (state.phaseType === "ban") {
        handleBanPhase(socket, state, setDraftState);
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
    const startBanPhase = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handleBanPhase(socket, state, setDraftState);
    };

    const startPickPhase = (state: DraftProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));

      handlePickPhase(socket, state, setDraftState);
    };

    const endDraft = (state: DraftProps) => {
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
      setDraftState((prevState) => {
        const { timer, ...rest } = prevState;
        return {
          ...rest,
          ...state,
          timer: 30,
        };
      });
    };
    socket.on("currentTurn", handleCurrentTurn);

    return () => {
      socket.off("currentTurn", handleCurrentTurn);
    };
  }, [socket]);

  useEffect(() => {
    if (!fearlessSocket) return;
    if (!fearlessCode) return
    fearlessSocket.emit("fearlessStateUpdate", (fearlessCode))
  }, [fearlessCode, fearlessSocket])

  useEffect(() => {
    if (!fearlessSocket) return;
    
    console.log("Draft complete status:", draftState.draftComplete);
    console.log("Current fearlessState:", fearlessState);
    
    if (draftState.draftComplete) {
      console.log("Emitting draftCompleted event");
      fearlessSocket.emit("draftCompleted");
    }
    const handleNextDraft = (newFearlessState: FearlessStateProps) => {
        setFearlessState((prevState) => ({
          ...prevState,
          ...newFearlessState,
        }));
      };
      fearlessSocket.on("nextDraft", handleNextDraft);
  
      return () => {
        fearlessSocket.off("nextDraft", handleNextDraft)
      }
  }, [draftState.draftComplete, fearlessSocket]);

  if (lobbyCode && streamMode && (socket || isPastDraft) && !error) {
    return (
      <StreamDisplay
        draftState={draftState}
        lobbyCode={lobbyCode}
        sideCode={sideCode}
        championRoles={championRoles}
        playerSide={playerSide}
      />
    );
  } else if (draftState && lobbyCode && (socket || isPastDraft) && !error) {
    return (
      <DraftDisplay
        draftState={draftState}
        lobbyCode={lobbyCode}
        sideCode={sideCode}
        championRoles={championRoles}
        playerSide={playerSide}
      />
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

export default FearlessDraftPage;
