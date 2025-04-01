import { useEffect, useState } from "react";
import { DraftButtonProps } from "./draftInterfaces";
import { pickHandler, readyHandler } from "./draftHandler";
import { useSocketContext } from "./providers/DraftProvider";

function DraftButton({
  draftState,
  lobbyCode,
  sideCode,
  playerSide,
  chosenChamp,
  setChosenChamp,
}: DraftButtonProps) {
  const { socket } = useSocketContext();

  const [ready, setReady] = useState<boolean>(false);
  const [banPhase, setBanPhase] = useState<boolean>(false);
  const [pickPhase, setPickPhase] = useState<boolean>(false);

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
  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(lobbyCode, sideCode, newReady, socket);
      return newReady;
    });
  };

  const sendPick = (chosenChamp: string) => {
    pickHandler(lobbyCode, sideCode, chosenChamp, socket, banPhase, pickPhase);
    setChosenChamp("");
  };
  return (
    <>
      {/* Ready Button */}
      {draftState.draftComplete ? (
        <button
          className={`Timer p-4 bg-gray ${
            banPhase || pickPhase ? "hidden" : ""
          } max-h-16 flex items-center justify-center hover:cursor-default rounded-md transition duration-300`}
        >
          Draft Finished
        </button>
      ) : !draftState.activePhase ? (
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
      ) : (
        ""
      )}
      {/* Pick/Ban Button */}
      {draftState.displayTurn === playerSide &&
      draftState.activePhase &&
      draftState.activePhase !== "finished" ? (
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
      ) : (
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
      )}
    </>
  );
}

export default DraftButton;
