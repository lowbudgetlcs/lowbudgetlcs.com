import { DraftProps, DraftStateProps } from "./draftInterfaces";
import DisplayBanImage from "./DisplayBanImage";

const DisplayBans = ({
  bans,
  enemyBans,
  playerSide,
  playerTurn,
  currentPhase,
  currentHover,
}: {
  bans: string[];
  enemyBans: string[];
  playerSide: string;
  playerTurn: string | null;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
  let correctSideHover: string | null = null;
  if (currentPhase === "banPhase1" || currentPhase === "banPhase2") {
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

  return playerSide === "blue" ? (
    <>
      <div className="flex gap-4">
        <FirstBans
          bans={bans}
          side={playerSide}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
          currentHover={correctSideHover}
        />
      </div>
      <div className="space h-4 max-[1275px]:hidden"></div>
      <div className="flex gap-4">
        <LastBans
          bans={bans}
          side={playerSide}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
          currentHover={correctSideHover}
        />
      </div>
    </>
  ) : (
    <>
      <div className="flex gap-4">
        <LastBans
          bans={bans}
          side={playerSide}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
          currentHover={correctSideHover}
        />
      </div>
      <div className="space h-4 max-[1275px]:hidden"></div>
      <div className="flex gap-4">
        <FirstBans
          bans={bans}
          side={playerSide}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
          currentHover={correctSideHover}
        />
      </div>
    </>
  );
};

const FirstBans = ({
  bans,
  side,
  playerTurn,
  currentPhase,
  currentHover,
}: {
  bans: string[];
  side: string;
  playerTurn: string | null;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
  const banDivs = [];
  for (let i = 0; i < 3; i++) {
    banDivs.push(
      <div
        key={i}
        className={`ban${
          i + 1
        } w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 border-2 ${
          playerTurn === side &&
          side === "blue" &&
          currentPhase === "banPhase1" &&
          bans.length === i
            ? "border-blue transition-all delay-[20ms]"
            : playerTurn === side &&
              side === "red" &&
              currentPhase === "banPhase1" &&
              bans.length === i
            ? "border-red transition-all delay-[20ms]"
            : "border-gray"
        } bg-gray rounded-md overflow-hidden`}
      >
        <DisplayBanImage
          banIndex={i}
          bannedChampions={bans}
          currentHover={currentHover}
        />
      </div>
    );
  }
  return side === "blue" ? banDivs : banDivs.reverse();
};

const LastBans = ({
  bans,
  side,
  playerTurn,
  currentPhase,
  currentHover,
}: {
  bans: string[];
  side: string;
  playerTurn: string | null;
  currentPhase: DraftStateProps["activePhase"];
  currentHover: DraftProps["currentHover"];
}) => {
  const banDivs = [];
  for (let i = 3; i < 5; i++) {
    banDivs.push(
      <div
        key={i}
        className={`ban${
          i + 1
        } w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 border-2 ${
          playerTurn === side &&
          side === "blue" &&
          currentPhase === "banPhase2" &&
          bans.length === i
            ? "border-blue transition-all delay-[20ms]"
            : playerTurn === side &&
              side === "red" &&
              currentPhase === "banPhase2" &&
              bans.length === i
            ? "border-red transition-all delay-[20ms]"
            : "border-gray"
        } bg-gray rounded-md overflow-hidden`}
      >
        <DisplayBanImage
          banIndex={i}
          bannedChampions={bans}
          currentHover={currentHover}
        />
      </div>
    );
  }
  return side === "blue" ? banDivs : banDivs.reverse();
};

export default DisplayBans;
