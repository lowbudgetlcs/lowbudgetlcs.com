import { memo, useEffect, useState } from "react";
import { DraftProps, DraftStateProps } from "./draftInterfaces";
import DisplayBanImage from "./DisplayBanImage";

const DisplayBans = ({
  draftState,
  bans,
  enemyBans,
  playerSide,
  playerTurn,
  currentPhase,
  currentHover,
}: {
  draftState: DraftProps;
  bans: string[];
  enemyBans: string[];
  playerSide: string;
  playerTurn: string | null;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
  const [sideBan, setSideBan] = useState<number>();

  useEffect(() => {
    if (playerSide === "blue") {
      setSideBan(draftState.currentBlueBan);
    } else {
      setSideBan(draftState.currentRedBan);
    }
  }, [draftState.currentBlueBan, draftState.currentRedBan, playerSide]);

  const shouldRender = (banIndex: number) => {
    if (bans[banIndex]) return true;

    const isSlotActive = sideBan === banIndex;
    const previousFilled = Array.from(
      { length: banIndex },
      (_, i) => bans[i]
    ).every(Boolean);

    return isSlotActive && previousFilled;
  };

  let correctSideHover: string | null = null;
  if (currentPhase?.includes("banPhase")) {
    if (
      playerSide !== playerTurn ||
      currentHover === null ||
      bans.concat(enemyBans).includes(currentHover)
    ) {
      correctSideHover = null;
    } else {
      correctSideHover = currentHover;
    }
  }

  return (
    <>
      {/* Ban Phase 1 */}
      <div
        className={`flex gap-4 ${
          playerSide === "red" ? "flex-row-reverse" : ""
        }`}
      >
        {(playerSide === "blue" ? [0, 1, 2] : [3, 4]).map((index) => (
          <div
            key={index}
            className={`w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 ${
              playerTurn === playerSide &&
              playerSide === "blue" &&
              currentPhase === "banPhase1" &&
              sideBan === index &&
              !bans[index]
                ? "border-blue border-4"
                : playerTurn === playerSide &&
                  playerSide === "red" &&
                  currentPhase === "banPhase2" &&
                  sideBan === index &&
                  !bans[index]
                ? "border-red border-4"
                : "border-gray border-2"
            } border-2 bg-gray/60 rounded-md overflow-hidden transition-all`}
          >
            {shouldRender(index) && (
              <DisplayBanImage
                banIndex={index}
                bannedChampions={bans}
                currentHover={correctSideHover}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space h-4 max-[1275px]:hidden" />

      {/* Ban Phase 2 */}
      <div
        className={`flex gap-4 ${
          playerSide === "red" ? "flex-row-reverse" : ""
        }`}
      >
        {(playerSide === "blue" ? [3, 4] : [0, 1, 2]).map((index) => (
          <div
            key={index}
            className={`w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 ${
              playerTurn === playerSide &&
              playerSide === "blue" &&
              currentPhase === "banPhase2" &&
              sideBan === index &&
              !bans[index]
                ? "border-blue border-4"
                : playerTurn === playerSide &&
                  playerSide === "red" &&
                  currentPhase === "banPhase1" &&
                  sideBan === index &&
                  !bans[index]
                ? "border-red border-4"
                : "border-gray border-2"
            } bg-gray/60 rounded-md overflow-hidden transition-all`}
          >
            {shouldRender(index) && (
              <DisplayBanImage
                banIndex={index}
                bannedChampions={bans}
                currentHover={correctSideHover}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(DisplayBans);
