import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { FearlessStateProps } from "../interfaces/draftInterfaces";
import fearlessConnectionHandler from "../connectionHandlers/fearlessConnectionHandler";
import FearlessSidePick from "../draftViews/FearlessSidePick";
import Button from "../../Button";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessMain = () => {
  const { fearlessCode, teamCode } = useParams();
  const { fearlessSocket, fearlessState, setFearlessState } =
    useFearlessContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSide, setSelectedSide] = useState<string>();
  const [team, setTeam] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  //   Opens the socket and starts the side selection
  const initialConnection = () => {
    setLoading(true);
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}/fearless`);
    setFearlessSocket(newSocket);

    const startConnection = () =>
      fearlessConnectionHandler(
        newSocket,
        fearlessCode,
        teamCode,
        setError,
        setFearlessState,
        setTeam,
        setLoading
      );

    newSocket.on("connect", startConnection);
  };
  useEffect(() => {
    initialConnection();
  }, []);

  // Handle Fearless state updates
  useEffect(() => {
    if (!fearlessSocket) {
      return;
    }

    const updateFearlessState = (state: FearlessStateProps) => {
      setFearlessState((prevState) => ({
        ...prevState,
        ...state,
      }));
    };

    fearlessSocket.on("fearlessState", updateFearlessState);
  }, [fearlessSocket]);
  // Add this before your render conditions
  console.log("FearlessMain render state:", {
    loading,
    hasState: fearlessState,
    hasTeam: team,
    error,
  });
  if (loading || (!fearlessState && !team)) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
        <p>Loading Draft</p>
        <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
      </div>
    );
  } else if (fearlessState && team) {
    return fearlessState.currentDraft ? (
      <>
        {/* Navigates to FearlessDraftPage */}
        <Navigate
          to={`/draft/fearless/${fearlessCode}/${teamCode}/${fearlessState.currentDraft}`}
        />
      </>
    ) : (
      <>
        <FearlessSidePick
          teamDisplay={team}
          setSelectedSide={setSelectedSide}
        />
      </>
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
  } else {
    // Add a default return for any other state
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center">
        <p>Initializing... Please wait.</p>
      </div>
    );
  }
};

export default FearlessMain;
