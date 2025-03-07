import { memo } from "react";
import { Champion, DraftProps, DraftStateProps } from "./draftInterfaces";
import DisplayPickImage from "./DisplayPickImage";

const DisplayPicks = ({
  picks,
  enemyPicks,
  championRoles,
  playerTurn,
  playerSide,
  currentPhase,
  currentHover,
}: {
  picks: string[];
  enemyPicks: string[];
  championRoles: Champion[];
  playerTurn: string | null;
  playerSide: string;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
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
      <FirstPicks
        picks={picks}
        championRoles={championRoles}
        playerTurn={playerTurn}
        playerSide={playerSide}
        currentPhase={currentPhase}
        currentHover={correctSideHover}
      />
      <div className="space h-4"></div>
      <LastPicks
        picks={picks}
        championRoles={championRoles}
        playerTurn={playerTurn}
        playerSide={playerSide}
        currentPhase={currentPhase}
        currentHover={correctSideHover}
      />
    </>
  );
};

const FirstPicks = memo(
  ({
    picks,
    championRoles,
    playerTurn,
    playerSide,
    currentPhase,
    currentHover,
  }: {
    picks: string[];
    championRoles: Champion[];
    playerTurn: string | null;
    playerSide: string;
    currentPhase: DraftStateProps["activePhase"];
    currentHover: DraftProps["currentHover"];
  }) => {
    const pickDivs = [];
    for (let i = 0; i < 3; i++) {
      pickDivs.push(
        <div
          key={i}
          className={`pick${i + 1} w-64 h-28 overflow-hidden border-2 ${
            playerTurn === playerSide &&
            playerSide === "blue" &&
            currentPhase === "pickPhase1" &&
            picks.length === i
              ? "border-blue transition-all delay-[20ms]"
              : playerTurn === playerSide &&
                playerSide === "red" &&
                currentPhase === "pickPhase1" &&
                picks.length === i
              ? "border-red transition-all delay-[20ms]"
              : "border-gray"
          } bg-gray/60 rounded-md`}
        >
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={i}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={currentHover}
          />
        </div>
      );
    }
    return pickDivs;
  }
);
const LastPicks = memo(
  ({
    picks,
    championRoles,
    playerTurn,
    playerSide,
    currentPhase,
    currentHover,
  }: {
    picks: string[];
    championRoles: Champion[];
    playerTurn: string | null;
    playerSide: string;
    currentPhase: DraftStateProps["activePhase"];
    currentHover: DraftProps["currentHover"];
  }) => {
    const pickDivs = [];
    for (let i = 3; i < 5; i++) {
      pickDivs.push(
        <div
          key={i}
          className={`pick${i + 1} w-64 h-28 overflow-hidden border-2 ${
            playerTurn === playerSide &&
            playerSide === "blue" &&
            currentPhase === "pickPhase2" &&
            picks.length === i
              ? "border-blue transition-all delay-[20ms]"
              : playerTurn === playerSide &&
                playerSide === "red" &&
                currentPhase === "pickPhase2" &&
                picks.length === i
              ? "border-red transition-all delay-[20ms]"
              : "border-gray"
          } bg-gray/60 rounded-md`}
        >
          <DisplayPickImage
            playerSide={playerSide}
            pickIndex={i}
            pickedChampions={picks}
            championRoles={championRoles}
            currentHover={currentHover}
          />
        </div>
      );
    }
    return pickDivs;
  }
);

export default memo(DisplayPicks);
