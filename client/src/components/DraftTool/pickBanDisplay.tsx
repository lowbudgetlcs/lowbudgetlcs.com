import { memo } from "react";
import { Champion } from "./draftInterfaces";
import { DisplayBanImage, DisplayPickImage } from "./LoadChampLargeImages";
const FirstPicks = memo(
  ({
    picks,
    championRoles,
  }: {
    picks: string[];
    championRoles: Champion[];
  }) => {
    const pickDivs = [];
    for (let i = 0; i < 3; i++) {
      pickDivs.push(
        <div
          key={i}
          className={`pick${i + 1} w-64 h-28 overflow-hidden bg-gray`}
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
  }: {
    picks: string[];
    championRoles: Champion[];
  }) => {
    const pickDivs = [];
    for (let i = 3; i < 5; i++) {
      pickDivs.push(
        <div
          key={i}
          className={`pick${i + 1} w-64 h-28 overflow-hidden bg-gray`}
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
}: {
  picks: string[];
  championRoles: Champion[];
}) => {
  return (
    <>
      <FirstPicks picks={picks} championRoles={championRoles} />
      <div className="space h-4"></div>
      <LastPicks picks={picks} championRoles={championRoles} />
    </>
  );
};

const FirstBans = memo(
  ({
    bans,
    side,
    championRoles,
  }: {
    bans: string[];
    side: string;
    championRoles: Champion[];
  }) => {
    const banDivs = [];
    for (let i = 0; i < 3; i++) {
      banDivs.push(
        <div
          key={i}
          className={`ban${i + 1} w-24 h-24 bg-gray overflow-hidden`}
        >
          {DisplayBanImage(i, bans, championRoles)}
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
    championRoles,
  }: {
    bans: string[];
    side: string;
    championRoles: Champion[];
  }) => {
    const banDivs = [];
    for (let i = 3; i < 5; i++) {
      banDivs.push(
        <div
          key={i}
          className={`ban${i + 1} w-24 h-24 bg-gray overflow-hidden`}
        >
          {DisplayBanImage(i, bans, championRoles)}
        </div>
      );
    }
    return side === "blue" ? banDivs : banDivs.reverse();
  }
);

export const DisplayBans = ({
  bans,
  side,
  championRoles,
}: {
  bans: string[];
  side: string;
  championRoles: Champion[];
}) => {
  return side === "blue" ? (
    <>
      <FirstBans bans={bans} side={side} championRoles={championRoles} />
      <div className="space h-4"></div>
      <LastBans bans={bans} side={side} championRoles={championRoles} />
    </>
  ) : (
    <>
      <LastBans bans={bans} side={side} championRoles={championRoles} />
      <div className="space h-4"></div>
      <FirstBans bans={bans} side={side} championRoles={championRoles} />
    </>
  );
};
