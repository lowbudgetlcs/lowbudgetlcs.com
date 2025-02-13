import { memo, useEffect, useState } from "react";
import { Champion, DraftProps, DraftStateProps } from "./draftInterfaces";
import DisplayPickImage from "./DisplayPickImage";

const DisplayPicks = ({
  draftState,
  picks,
  enemyPicks,
  championRoles,
  playerTurn,
  playerSide,
  currentPhase,
  currentHover,
}: {
  draftState: DraftProps;
  picks: string[];
  enemyPicks: string[];
  championRoles: Champion[];
  playerTurn: string | null;
  playerSide: string;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
  const [sidePick, setSidePick] = useState<number>();

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
    const previousSlotsFilled = Array.from({ length: pickIndex }, (_, i) => picks[i]).every(Boolean);

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
      <div
        className={`pick1 w-64 h-28 overflow-hidden  ${
          playerTurn === playerSide &&
          playerSide === "blue" &&
          currentPhase === "pickPhase1" &&
          sidePick === 0
            ? "border-blue transition-all delay-[20ms] border-4"
            : playerTurn === playerSide &&
              playerSide === "red" &&
              currentPhase === "pickPhase1" &&
              sidePick === 0
            ? "border-red transition-all delay-[20ms] border-4"
            : "border-gray border-2"
        } bg-gray/60 rounded-md`}
      >
        {shouldRender(0) && (
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={0}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={correctSideHover}
          />
        )}
      </div>
      <div
        className={`pick2 w-64 h-28 overflow-hidden  ${
          playerTurn === playerSide &&
          playerSide === "blue" &&
          currentPhase === "pickPhase1" &&
          sidePick === 1
            ? "border-blue transition-all delay-[20ms] border-4"
            : playerTurn === playerSide &&
              playerSide === "red" &&
              currentPhase === "pickPhase1" &&
              sidePick === 1
            ? "border-red transition-all delay-[20ms] border-4"
            : "border-gray border-2"
        } bg-gray/60 rounded-md`}
      >
        {shouldRender(1) && (
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={1}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={correctSideHover}
          />
        )}
      </div>
      <div
        className={`pick3 w-64 h-28 overflow-hidden  ${
          playerTurn === playerSide &&
          playerSide === "blue" &&
          currentPhase === "pickPhase1" &&
          sidePick === 2
            ? "border-blue transition-all delay-[20ms] border-4"
            : playerTurn === playerSide &&
              playerSide === "red" &&
              currentPhase === "pickPhase1" &&
              sidePick === 2
            ? "border-red transition-all delay-[20ms] border-4"
            : "border-gray border-2"
        } bg-gray/60 rounded-md`}
      >
        {shouldRender(2) && (
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={2}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={correctSideHover}
          />
        )}
      </div>
      <div className="space h-4"></div>
      <div
        className={`pick4 w-64 h-28 overflow-hidden  ${
          playerTurn === playerSide &&
          playerSide === "blue" &&
          currentPhase === "pickPhase2" &&
          sidePick === 3
            ? "border-blue transition-all delay-[20ms] border-4"
            : playerTurn === playerSide &&
              playerSide === "red" &&
              currentPhase === "pickPhase2" &&
              sidePick === 3
            ? "border-red transition-all delay-[20ms] border-4"
            : "border-gray border-2"
        } bg-gray/60 rounded-md`}
      >
        {shouldRender(3) && (
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={3}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={correctSideHover}
          />
        )}
      </div>
      <div
        className={`pick5 w-64 h-28 overflow-hidden  ${
          playerTurn === playerSide &&
          playerSide === "blue" &&
          currentPhase === "pickPhase2" &&
          sidePick === 4
            ? "border-blue transition-all delay-[20ms] border-4"
            : playerTurn === playerSide &&
              playerSide === "red" &&
              currentPhase === "pickPhase2" &&
              sidePick === 4
            ? "border-red transition-all delay-[20ms] border-4"
            : "border-gray border-2"
        } bg-gray/60 rounded-md`}
      >
        {shouldRender(4) && (
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={4}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={correctSideHover}
          />
        )}
      </div>
    </>
  );
};

export default memo(DisplayPicks);
