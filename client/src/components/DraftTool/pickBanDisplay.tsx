import { DisplayBanImage, DisplayPickImage } from "./LoadChampLargeImages";

export const DisplayPicks = ({ picks }: { picks: string[] }) => {
  const FirstPicks = () => {
    const pickDivs = [];
    for (let i = 0; i < 3; i++) {
      pickDivs.push(
        <div className={`pick${i + 1} w-64 h-28 overflow-hidden bg-gray`}>
          {DisplayPickImage(i, picks)}
        </div>
      );
    }
    return pickDivs;
  };
  const LastPicks = () => {
    const pickDivs = [];
    for (let i = 3; i < 5; i++) {
      pickDivs.push(
        <div className={`pick${i + 1} w-64 h-28 overflow-hidden bg-gray`}>
          {DisplayPickImage(i, picks)}
        </div>
      );
    }
    return pickDivs;
  };
  return (
    <>
      <FirstPicks />
      <div className="space h-4"></div>
      <LastPicks />
    </>
  );
};

export const DisplayBans = ({
  bans,
  side,
}: {
  bans: string[];
  side: string;
}) => {
  const FirstBans = () => {
    const banDivs = [];
    for (let i = 0; i < 3; i++) {
      banDivs.push(
        <div className={`ban${i + 1} w-24 h-24 bg-gray overflow-hidden`}>
          {DisplayBanImage(i, bans)}
        </div>
      );
    }
    return side === "blue" ? banDivs : banDivs.reverse();
  };

  const LastBans = () => {
    const banDivs = [];
    for (let i = 3; i < 5; i++) {
      banDivs.push(
        <div className={`ban${i + 1} w-24 h-24 bg-gray overflow-hidden`}>
          {DisplayBanImage(i, bans)}
        </div>
      );
    }
    return side === "blue" ? banDivs : banDivs.reverse();
  };

  return side === "blue" ? (
    <>
      <FirstBans />
      <div className="space h-4"></div>
      <LastBans />
    </>
  ) : (
    <>
      <LastBans />
      <div className="space h-4"></div>
      <FirstBans />
    </>
  );
};
