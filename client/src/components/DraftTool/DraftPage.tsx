import { useEffect, useState } from "react";
import { connectionHandler } from "./draftHandler";
import { Link, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "./clientDraftHandler";

import championsData from "./championRoles.json";
import { Champion, DraftProps, DraftStateProps } from "./draftInterfaces";
import DraftDisplay from "./DraftDisplay";
import Button from "../Button";

function DraftPage() {
  const [draftState, setDraftState] = useState<DraftProps>({
    draftStarted: false,
    activePhase: null,
    phaseType: null,
    blueDisplayName: "Blue Team",
    redDisplayName: "Red Team",
    blueReady: false,
    redReady: false,
    timer: 34,
    bansArray: [],
    picksArray: [],
    bluePicks: [],
    redPicks: [],
    blueBans: [],
    redBans: [],
    banIndex: 0,
    pickIndex: 0,
    currentTurn: "",
    displayTurn: null,
    currentHover: null,
    bluePick: "nothing",
    redPick: "nothing",
    draftComplete: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [banPhase, setBanPhase] = useState<boolean>(false);
  const [pickPhase, setPickPhase] = useState<boolean>(false);
  const [championRoles, setChampionRoles] = useState<Champion[]>([]);
  const [playerSide, setPlayerSide] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  useEffect(() => {
    setLoading(true);
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    setChampionRoles(championsData);
    console.log("lobby code: ", lobbyCode);

    // Run connection Handler Function with lobby code
    const startConnection = async () => {
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
    
    // Cleanup on unmount
    return () => {
      newSocket.off("connect", startConnection);
      newSocket.disconnect();
    };
  }, [lobbyCode, sideCode]);

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
      setPickPhase(false);
      setBanPhase(true);
      handleBanPhase(socket, state, draftState, setDraftState);
    };

    const startPickPhase = (state: DraftStateProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
      setPickPhase(true);
      setBanPhase(false);
      handlePickPhase(socket, state, draftState, setDraftState);
    };

    const endDraft = (state: DraftStateProps) => {
      setDraftState((prevState) => ({
        ...prevState,
        ...state,
      }));
      setBanPhase(false);
      setPickPhase(false);
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

  if (draftState && lobbyCode && socket && !error) {
    return (
      <>
        <DraftDisplay
          draftState={draftState}
          lobbyCode={lobbyCode}
          sideCode={sideCode}
          socket={socket}
          championRoles={championRoles}
          banPhase={banPhase}
          pickPhase={pickPhase}
          playerSide={playerSide}
        />
      </>
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
