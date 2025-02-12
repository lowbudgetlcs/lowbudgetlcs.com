import { useState } from "react";
import { DraftButtonProps } from "./draftInterfaces";
import { pickHandler, readyHandler } from "./draftHandler";

function DraftButton({
  draftState,
  lobbyCode,
  sideCode,
  socket,
  banPhase,
  pickPhase,
  playerSide,
  chosenChamp,
  setChosenChamp,
}: DraftButtonProps) {
  const [ready, setReady] = useState<boolean>(false);
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
      {draftState.draftComplete === true ? (
        <button
          className={`Timer p-4 bg-gray ${
            banPhase || pickPhase ? "hidden" : ""
          } max-h-16 flex items-center justify-center hover:cursor-default rounded-md transition duration-300`}
        >
          Draft Finished
        </button>
      ) : (
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
      )}
      {/* Pick/Ban Button */}
      {draftState.displayTurn === playerSide ? (
        <button
          onClick={() => {
            if (chosenChamp) {
              sendPick(chosenChamp);
            }
          }}
          className={`Timer p-4 ${
            chosenChamp
              ? playerSide === "blue"
                ? "bg-blue"
                : playerSide === "red"
                ? "bg-red"
                : "bg-gray"
              : "bg-gray"
          } ${
            banPhase || pickPhase ? "" : "hidden"
          } max-h-16 flex items-center justify-center hover:cursor-pointer rounded-md  ${
            playerSide === "blue" && chosenChamp
              ? " hover:brightness-150 hover:shadow-lg shadow-blue"
              : playerSide === "red" && chosenChamp
              ? " hover:brightness-150 hover:shadow-lg shadow-red"
              : "bg-gray"
          } transition duration-300`}
        >
          Lock In
        </button>
      ) : (
        <button
          className={
            playerSide !== "spectator"
              ? `Timer p-4 bg-gray ${
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
