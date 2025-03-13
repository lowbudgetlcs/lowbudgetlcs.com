import { memo, useEffect, useState } from "react";
import { Champion, DraftProps, DraftStateProps } from "../draftInterfaces";
import StreamPickImage from "./StreamPickImage";

const StreamPicks = ({
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
  const [link, setLink] = useState<string>("#");

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

  // Pre-renders image for pick animation
  // Image is hidden on the page inside img tag
  useEffect(() => {
    if (draftState.phaseType === "pick" && currentHover) {
      setLink(
        `https://cdn.communitydragon.org/latest/champion/${currentHover}/splash-art/centered`
      );
    } else {
      setLink("#");
    }
  }, [currentHover, draftState.phaseType]);

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
          className={`relative w-32 h-64 overflow-hidden border-2 ${
            playerTurn === playerSide &&
            playerSide === "blue" &&
            currentPhase === "pickPhase1" &&
            sidePick === index
              ? "border-blue transition-all"
              : playerTurn === playerSide &&
                playerSide === "red" &&
                currentPhase === "pickPhase1" &&
                sidePick === index
              ? "border-red transition-all"
              : "border-gray"
          } bg-gray/60 rounded-md flex items-center`}
        >
          {shouldRender(index) && (
            <StreamPickImage
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
          className={`relative w-32 h-64 overflow-hidden border-2 ${
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
          } bg-gray/60 rounded-md flex items-center`}
        >
          {shouldRender(index) && (
            <StreamPickImage
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
      <img src={link} className="absolute top-0 w-0 h-0 opacity-0" />
    </>
  );
};

export default memo(StreamPicks);
