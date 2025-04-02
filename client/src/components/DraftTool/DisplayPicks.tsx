import { memo, useEffect, useState } from "react";
import { Champion } from "./draftInterfaces";
import DisplayPickImage from "./DisplayPickImage";
import { useDraftContext } from "./providers/DraftProvider";

const DisplayPicks = ({
  championRoles,
  playerSide,
}: {
  championRoles: Champion[];
  playerSide: string;
}) => {
  const [sidePick, setSidePick] = useState<number>();
  const { draftState, currentHover } = useDraftContext();

  const currentPhase = draftState.activePhase;
  const playerTurn = draftState.currentTurn;
  const picks =
    playerSide === "blue" ? draftState.bluePicks : draftState.redPicks;
  const enemyPicks =
    playerSide === "blue" ? draftState.redPicks : draftState.bluePicks;

  useEffect(() => {
    if (playerSide === "blue") {
      setSidePick(draftState.currentBluePick);
    } else if (playerSide === "red") {
      setSidePick(draftState.currentRedPick);
    }
  }, [
    draftState.currentTurn,
    draftState.currentRedPick,
    draftState.currentBluePick,
  ]);

  const shouldRender = (pickIndex: number) => {
    if (picks[pickIndex]) {
      return true;
    }

    const isSlotActive = sidePick === pickIndex;
    const previousSlotsFilled = Array.from(
      { length: pickIndex },
      (_, i) => picks[i]
    ).every(Boolean);

    return isSlotActive && previousSlotsFilled;
  };
  let correctSideHover: string | null = null;
  if (currentPhase === "pickPhase1" || currentPhase === "pickPhase2") {
    if (
      playerSide !== playerTurn ||
      currentHover === null ||
      picks.concat(enemyPicks).includes(currentHover)
    ) {
      correctSideHover = null;
    } else {
      correctSideHover = currentHover;
    }
  }
  return (
    <>
      {/* Pick Phase 1 */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`relative w-64 h-28 overflow-hidden border-2 ${
            playerTurn === playerSide &&
            playerSide === "blue" &&
            currentPhase === "pickPhase1" &&
            sidePick === index
              ? "border-blue transition-all "
              : playerTurn === playerSide &&
                playerSide === "red" &&
                currentPhase === "pickPhase1" &&
                sidePick === index
              ? "border-red transition-all"
              : "border-gray"
          } bg-gray/60 rounded-md`}
        >
          {shouldRender(index) && (
            <DisplayPickImage
              playerSide={playerSide}
              pickIndex={index}
              pickedChampions={picks}
              championRoles={championRoles}
              currentHover={correctSideHover}
            />
          )}
          <div
            className={`gradientAnimation absolute w-full h-full top-0 bg-gradient-to-b from-transparent via-transparent animate-pulse 
              ${
                playerTurn === playerSide &&
                playerSide === "blue" &&
                currentPhase === "pickPhase1" &&
                sidePick === index
                  ? "to-blue"
                  : playerTurn === playerSide &&
                    playerSide === "red" &&
                    currentPhase === "pickPhase1" &&
                    sidePick === index
                  ? "to-red"
                  : "hidden"
              }`}
          ></div>
        </div>
      ))}

      <div className="space h-4"></div>

      {/* Pick Phase 2 */}
      {[3, 4].map((index) => (
        <div
          key={index}
          className={`relative w-64 h-28 overflow-hidden border-2 ${
            playerTurn === playerSide &&
            playerSide === "blue" &&
            currentPhase === "pickPhase2" &&
            sidePick === index
              ? "border-blue transition-all delay-[20ms]"
              : playerTurn === playerSide &&
                playerSide === "red" &&
                currentPhase === "pickPhase2" &&
                sidePick === index
              ? "border-red transition-all delay-[20ms]"
              : "border-gray"
          } bg-gray/60 rounded-md`}
        >
          {shouldRender(index) && (
            <DisplayPickImage
              playerSide={playerSide}
              pickIndex={index}
              pickedChampions={picks}
              championRoles={championRoles}
              currentHover={correctSideHover}
            />
          )}
          <div
            className={`gradientAnimation absolute w-full h-full top-0 bg-gradient-to-b from-transparent via-transparent animate-pulse 
              ${
                playerTurn === playerSide &&
                playerSide === "blue" &&
                currentPhase === "pickPhase2" &&
                sidePick === index
                  ? "to-blue"
                  : playerTurn === playerSide &&
                    playerSide === "red" &&
                    currentPhase === "pickPhase2" &&
                    sidePick === index
                  ? "to-red"
                  : "hidden"
              }`}
          ></div>
        </div>
      ))}
    </>
  );
};

export default memo(DisplayPicks);
