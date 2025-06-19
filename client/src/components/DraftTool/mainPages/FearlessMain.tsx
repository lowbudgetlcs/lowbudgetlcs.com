import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import FearlessSidePick from "../draftViews/FearlessSidePick";
import Button from "../../Button";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessMain = () => {
  const { fearlessCode, teamCode } = useParams();
  const { fearlessState, team, loading, error, initializeFearless } =
    useFearlessContext();

  // Initialize fearless connection
  useEffect(() => {
    if (!fearlessCode) return;
    if (teamCode) {
      initializeFearless(fearlessCode, teamCode);
    } else {
      initializeFearless(fearlessCode, "spectator");
    }
  }, [fearlessCode, teamCode, initializeFearless]);
  if (loading) {
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
          to={`/fearless/${fearlessCode}/${teamCode}/${fearlessState.currentDraft}`}
        />
      </>
    ) : (
      <>
        <FearlessSidePick teamDisplay={team} />
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
          <Link to={"/"}>
            <Button>Back to Draft Creation</Button>
          </Link>
        </div>
      </div>
    );
  } else if (
    fearlessState &&
    fearlessState.draftLobbyCodes &&
    fearlessState.fearlessComplete
  ) {
    return (
      <>
        {/* Navigates to first fearless draft if the fearless is complete */}
        <Navigate
          to={`/fearless/${fearlessCode}/${teamCode || "spectator"}/${
            fearlessState.draftLobbyCodes[0]
          }`}
        />
      </>
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
