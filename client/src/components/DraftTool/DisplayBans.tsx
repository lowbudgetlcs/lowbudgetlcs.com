import { memo, useEffect, useState } from "react";
import DisplayBanImage from "./DisplayBanImage";
import { useDraftContext } from "./providers/DraftProvider";

const DisplayBans = ({ playerSide }: { playerSide: string }) => {
  const [sideBan, setSideBan] = useState<number>();
  const [link, setLink] = useState<string>("#");
  const { draftState, currentHover } = useDraftContext();

  const currentPhase = draftState.activePhase;
  const playerTurn = draftState.displayTurn;
  const bans = playerSide === "blue" ? draftState.blueBans : draftState.redBans;
  const enemyBans =
    playerSide === "blue" ? draftState.redBans : draftState.blueBans;

  useEffect(() => {
    if (playerSide === "blue") {
      setSideBan(draftState.currentBlueBan);
    } else {
      setSideBan(draftState.currentRedBan);
    }
  }, [draftState.currentBlueBan, draftState.currentRedBan, playerSide]);

  // Pre-renders image for ban animation
  // Image is hidden on the page inside img tag
  useEffect(() => {
    if (draftState.phaseType === "ban" && currentHover) {
      setLink(
        `https://cdn.communitydragon.org/latest/champion/${currentHover}/splash-art/centered`
      );
    } else {
      setLink("#");
    }
  }, [currentHover, draftState.phaseType]);

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
            className={`relative w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16  ${
              playerTurn === playerSide &&
              playerSide === "blue" &&
              currentPhase === "banPhase1" &&
              sideBan === index &&
              !bans[index]
                ? "border-blue"
                : playerTurn === playerSide &&
                  playerSide === "red" &&
                  currentPhase === "banPhase2" &&
                  sideBan === index &&
                  !bans[index]
                ? "border-red"
                : "border-gray"
            } border-2 bg-gray/60 rounded-md overflow-hidden transition-all`}
          >
            {shouldRender(index) && (
              <DisplayBanImage
                banIndex={index}
                bannedChampions={bans}
                currentHover={correctSideHover}
              />
            )}
            <div
              className={`gradientAnimation absolute w-full h-full top-0 bg-gradient-to-b from-transparent via-transparent animate-pulse 
              ${
                playerTurn === playerSide &&
                playerSide === "blue" &&
                currentPhase === "banPhase1" &&
                sideBan === index &&
                !bans[index]
                  ? "to-blue"
                  : playerTurn === playerSide &&
                    playerSide === "red" &&
                    currentPhase === "banPhase2" &&
                    sideBan === index &&
                    !bans[index]
                  ? " to-red"
                  : "hidden"
              }`}
            ></div>
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
            className={`relative w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 border-2 ${
              playerTurn === playerSide &&
              playerSide === "blue" &&
              currentPhase === "banPhase2" &&
              sideBan === index &&
              !bans[index]
                ? "border-blue"
                : playerTurn === playerSide &&
                  playerSide === "red" &&
                  currentPhase === "banPhase1" &&
                  sideBan === index &&
                  !bans[index]
                ? "border-red"
                : "border-gray"
            } bg-gray/60 rounded-md overflow-hidden transition-all`}
          >
            {shouldRender(index) && (
              <DisplayBanImage
                banIndex={index}
                bannedChampions={bans}
                currentHover={correctSideHover}
              />
            )}
            <div
              className={`gradientAnimation absolute w-full h-full top-0 bg-gradient-to-b from-transparent via-transparent animate-pulse 
              ${
                playerTurn === playerSide &&
                playerSide === "blue" &&
                currentPhase === "banPhase2" &&
                sideBan === index &&
                !bans[index]
                  ? "to-blue"
                  : playerTurn === playerSide &&
                    playerSide === "red" &&
                    currentPhase === "banPhase1" &&
                    sideBan === index &&
                    !bans[index]
                  ? " to-red"
                  : "hidden"
              }`}
            ></div>
          </div>
        ))}
        <img src={link} className="absolute top-0 w-0 h-0 opacity-0" />
      </div>
    </>
  );
};

export default memo(DisplayBans);
