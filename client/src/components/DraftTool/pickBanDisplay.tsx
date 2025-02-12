import { memo } from "react";
import { Champion, DraftStateProps } from "./draftInterfaces";
import { DisplayBanImage, DisplayPickImage } from "./LoadChampLargeImages";
const FirstPicks = memo(
  ({
    picks,
    championRoles,
    playerTurn,
    playerSide,
    currentPhase,
  }: {
    picks: string[];
    championRoles: Champion[];
    playerTurn: string | null;
    playerSide: string;
    currentPhase: DraftStateProps["activePhase"];
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
          } bg-gray rounded-md`}
        >
          {DisplayPickImage(i, picks, championRoles)}
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
  }: {
    picks: string[];
    championRoles: Champion[];
    playerTurn: string | null;
    playerSide: string;
    currentPhase: DraftStateProps["activePhase"];
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
          } bg-gray rounded-md`}
        >
          {DisplayPickImage(i, picks, championRoles)}
        </div>
      );
    }
    return pickDivs;
  }
);

export const DisplayPicks = ({
  picks,
  championRoles,
  playerTurn,
  playerSide,
  currentPhase,
}: {
  picks: string[];
  championRoles: Champion[];
  playerTurn: string | null;
  playerSide: string;
  currentPhase: DraftStateProps["activePhase"];
}) => {
  return (
    <>
      <FirstPicks
        picks={picks}
        championRoles={championRoles}
        playerTurn={playerTurn}
        playerSide={playerSide}
        currentPhase={currentPhase}
      />
      <div className="space h-4"></div>
      <LastPicks
        picks={picks}
        championRoles={championRoles}
        playerTurn={playerTurn}
        playerSide={playerSide}
        currentPhase={currentPhase}
      />
    </>
  );
};

const FirstBans = memo(
  ({
    bans,
    side,
    playerTurn,
    currentPhase,
  }: {
    bans: string[];
    side: string;
    playerTurn: string | null;
    currentPhase: DraftStateProps["activePhase"];
  }) => {
    const banDivs = [];
    for (let i = 0; i < 3; i++) {
      banDivs.push(
        <div
          key={i}
          className={`ban${i + 1} w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 border-2 ${
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
          {DisplayBanImage(i, bans)}
        </div>
      );
    }
    return side === "blue" ? banDivs : banDivs.reverse();
  }
);

const LastBans = memo(
  ({
    bans,
    side,
    playerTurn,
    currentPhase,
  }: {
    bans: string[];
    side: string;
    playerTurn: string | null;
    currentPhase: DraftStateProps["activePhase"];
  }) => {
    const banDivs = [];
    for (let i = 3; i < 5; i++) {
      banDivs.push(
        <div
          key={i}
          className={`ban${i + 1} w-24 h-24 max-[1275px]:w-16 max-[1275px]:h-16 border-2 ${
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
          {DisplayBanImage(i, bans)}
        </div>
      );
    }
    return side === "blue" ? banDivs : banDivs.reverse();
  }
);

export const DisplayBans = ({
  bans,
  side,
  playerTurn,
  currentPhase,
}: {
  bans: string[];
  side: string;
  playerTurn: string | null;
  currentPhase: DraftStateProps["activePhase"];
}) => {
  return side === "blue" ? (
    <>
      <div className="flex gap-4">
        <FirstBans
          bans={bans}
          side={side}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
        />
      </div>
      <div className="space h-4 max-[1275px]:hidden"></div>
      <div className="flex gap-4">
        <LastBans
          bans={bans}
          side={side}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
        />
      </div>
    </>
  ) : (
    <>
      <div className="flex gap-4">
        <LastBans
          bans={bans}
          side={side}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
        />
      </div>
      <div className="space h-4 max-[1275px]:hidden"></div>
      <div className="flex gap-4">
        <FirstBans
          bans={bans}
          side={side}
          playerTurn={playerTurn}
          currentPhase={currentPhase}
        />
      </div>
    </>
  );
};
