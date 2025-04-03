import { useEffect, useState } from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useFearlessContext } from "./providers/FearlessProvider";
import { useDraftContext } from "./providers/DraftProvider";

// Checks if button is being used on a fearless draft
// Fearless drafts are within the fearless providor, if not this will cause errors
const useSafeFearlessContext = () => {
  try {
    return useFearlessContext();
  } catch (error) {
    return { fearlessState: null };
  }
};
function DraftButton() {
  const {
    draftState,
    playerSide,
    chosenChamp,
    setChosenChamp,
    readyHandler,
    pickHandler,
  } = useDraftContext();

  const { fearlessState } = useSafeFearlessContext();
  const [ready, setReady] = useState<boolean>(false);
  const [banPhase, setBanPhase] = useState<boolean>(false);
  const [pickPhase, setPickPhase] = useState<boolean>(false);

  // const params = useParams();
  // const teamCode = params.teamCode;

  useEffect(() => {
    if (playerSide === "red" && draftState.redReady) {
      setReady(true);
    }
    if (playerSide === "blue" && draftState.blueReady) {
      setReady(true);
    }
    if (playerSide === "red" && !draftState.redReady) {
      setReady(false);
    }
    if (playerSide === "blue" && !draftState.blueReady) {
      setReady(false);
    }
  }, [draftState.blueReady, draftState.redReady, playerSide]);

  useEffect(() => {
    if (draftState.phaseType === "ban") {
      setPickPhase(false);
      setBanPhase(true);
    } else if (draftState.phaseType === "pick") {
      setBanPhase(false);
      setPickPhase(true);
    } else {
      setBanPhase(false);
      setPickPhase(false);
    }
  }, [draftState.phaseType]);

  // Toggling if player is function
  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(newReady);
      return newReady;
    });
  };

  const sendPick = (chosenChamp: string) => {
    pickHandler(chosenChamp, pickPhase, banPhase);
    setChosenChamp("");
  };

  // Display Next Draft Btn
  if (draftState.draftComplete && 
    fearlessState && 
    fearlessState.draftLobbyCodes && 
    fearlessState.draftLobbyCodes.includes(
      sessionStorage.getItem("activeLobbyCode") || ""
    ) && 
    fearlessState.currentDraft !== sessionStorage.getItem("activeLobbyCode") &&
    !fearlessState.fearlessComplete) {
    return (
      <Link
        to={`/draft/fearless/${
          fearlessState.fearlessCode
        }/${sessionStorage.getItem("activeSideCode")}`}
      >
        <Button>Next Draft</Button>
      </Link>
    );
  }
  // Display Draft Finished Btn
  if (draftState.draftComplete) {
    return (
      <button
        className={`Timer p-4 bg-gray ${
          banPhase || pickPhase ? "hidden" : ""
        } max-h-16 flex items-center justify-center hover:cursor-default rounded-md transition duration-300`}
      >
        Draft Finished
      </button>
    );
  }
  // Display Ready Btn
  if (!draftState.activePhase) {
    return (
      <button
        onClick={toggleReady}
        className={
          playerSide !== "spectator"
            ? `p-4 ${ready ? "bg-gray" : "bg-orange"} ${
                banPhase || pickPhase ? "hidden" : ""
              } max-h-16 flex items-center justify-center hover:cursor-pointer rounded-md hover:shadow-lg ${
                playerSide === "blue"
                  ? "hover:shadow-blue"
                  : playerSide === "red"
                  ? "hover:shadow-red"
                  : ""
              } hover:bg-light-orange transition duration-300`
            : "hidden"
        }
      >
        {ready ? "Waiting" : "Ready"}
      </button>
    );
  }
  // Display Pick/ban Btn
  if (
    draftState.displayTurn === playerSide &&
    draftState.activePhase &&
    draftState.activePhase !== "finished"
  ) {
    return (
      <button
        onClick={() => {
          if (chosenChamp) {
            sendPick(chosenChamp);
          }
        }}
        className={`lockIn p-4 ${
          chosenChamp
            ? playerSide === "blue"
              ? "bg-blue"
              : playerSide === "red"
              ? "bg-red"
              : "bg-gray"
            : "bg-gray"
        } ${
          banPhase || pickPhase ? "" : "hidden"
        } max-h-16 flex items-center justify-center hover:cursor-pointer rounded-md hover:shadow-lg  ${
          playerSide === "blue" && chosenChamp
            ? " hover:brightness-150  hover:shadow-blue/60"
            : playerSide === "red" && chosenChamp
            ? " hover:brightness-150 hover:shadow-red/60"
            : "bg-gray"
        } transition duration-300`}
      >
        Lock In
      </button>
    );
  }
  // Display waiting turn btn by Default
  return (
    <button
      className={
        playerSide !== "spectator"
          ? `waiting p-4 bg-gray ${
              banPhase || pickPhase ? "" : "hidden"
            } max-h-16 flex items-center justify-center hover:cursor-wait rounded-md`
          : "hidden"
      }
    >
      Waiting Turn
    </button>
  );
}

export default DraftButton;
