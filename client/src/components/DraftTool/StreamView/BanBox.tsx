import { useEffect, useState } from "react";
import { Champion, DraftProps } from "../draftInterfaces";

const BanBox = ({
  draftState,
  championRoles,
}: {
  draftState: DraftProps;
  championRoles: Champion[];
}) => {
  const [animationState, setAnimationState] = useState("initial");
  const [champInfo, setChampInfo] = useState<Champion | undefined>(undefined);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const allBans = draftState.bansArray;
    const lastBan = allBans[allBans.length - 1];

    const selectedChampion = championRoles.find(
      (champion) => champion.name === lastBan
    );

    setChampInfo(selectedChampion);
    setImageLoaded(false);
  }, [draftState.bansArray, championRoles]);

  useEffect(() => {
    if (imageLoaded) {
      // Reset and start animation when character changes
      setAnimationState("initial");
      setTimeout(() => setAnimationState("entering"), 100);
      setTimeout(() => setAnimationState("visible"), 500);
      setTimeout(() => setAnimationState("exiting"), 1000);
      setTimeout(() => {
        setAnimationState("completed");
      }, 1400);
    }
  }, [imageLoaded]);

  const getAnimationStyles = () => {
    switch (animationState) {
      case "initial":
        return { opacity: 0, transform: "translateX(-100%)" };
      case "entering":
        return { opacity: 1, transform: "translateX(0)" };
      case "visible":
        return { opacity: 1, transform: "translateX(0)" };
      case "exiting":
        return { opacity: 0, transform: "translateX(100%)" };
      default:
        return { opacity: 0 };
    }
  };
  if (!champInfo) return null;

  const champInfoURL = `https://cdn.communitydragon.org/latest/champion/${champInfo.name}/splash-art/centered`;
  return (
    <div className="fixed bottom-12 inset-x-0 flex items-center justify-center z-50">
      <div
        className="flex flex-col items-center transition-all duration-500 ease-in-out"
        style={getAnimationStyles()}
      >
        <img
          src={champInfoURL}
          alt={champInfo.displayName}
          onLoad={() => setImageLoaded(true)}
          className={`h-64 object-contain mb-4 shadow-black z-10 rounded-md border-2 border-gray`}
        />
        <h2 className="text-3xl font-bold z-10">{champInfo.displayName}</h2>
        <div className="absolute -inset-7 blur-lg bg-zinc-950 w-[112%] h-[112%]"></div>
      </div>
    </div>
  );
};

export default BanBox;
