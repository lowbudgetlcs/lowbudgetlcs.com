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
          } max-h-16 flex items-center justify-center hover:cursor-default`}
        >
          Draft Finished
        </button>
      ) : (
        <button
          onClick={toggleReady}
          className={`p-4 ${ready ? "bg-gray" : "bg-orange"} ${
            banPhase || pickPhase ? "hidden" : ""
          } max-h-16 flex items-center justify-center hover:cursor-pointer`}
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
          className={`Timer p-4 ${chosenChamp ? "bg-orange" : "bg-gray"} ${
            banPhase || pickPhase ? "" : "hidden"
          } max-h-16 flex items-center justify-center hover:cursor-pointer`}
        >
          Lock In
        </button>
      ) : (
        <button
          className={`Timer p-4 bg-gray ${
            banPhase || pickPhase ? "" : "hidden"
          } max-h-16 flex items-center justify-center hover:cursor-wait`}
        >
          Waiting Turn
        </button>
      )}
    </>
  );
}

export default DraftButton;
