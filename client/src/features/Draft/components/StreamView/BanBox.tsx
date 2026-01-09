import { useEffect, useState } from "react";
import { Champion, DraftProps } from "../../interfaces/draftInterfaces";

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
      setTimeout(() => setAnimationState("entering"), 200);
      setTimeout(() => setAnimationState("visible"), 200);
      setTimeout(() => setAnimationState("exiting"), 1500);
      setTimeout(() => setAnimationState("exited"), 2000);
      setTimeout(() => {
        setAnimationState("completed");
      }, 2000);
    }
  }, [imageLoaded]);

  const getAnimationStyles = (championName: string) => {
    switch (animationState) {
      case "initial":
        if (
          draftState.bluePicks.includes(championName) ||
          draftState.blueBans.includes(championName)
        ) {
          return { opacity: 0, transform: "translateX(-50%)" };
        } else {
          return { opacity: 0, transform: "translateX(50%)" };
        }

      case "entering":
        return { opacity: 1, transform: "translateX(0)" };
      case "visible":
        return { opacity: 1, transform: "translateX(0)" };
      case "exiting":
        if (
          draftState.bluePicks.includes(championName) ||
          draftState.blueBans.includes(championName)
        ) {
          return { opacity: 0, transform: "translateX(50%)" };
        } else {
          return { opacity: 0, transform: "translateX(-50%)" };
        }
      case "exited":
        return { display: "none" };
      default:
        return { opacity: 0 };
    }
  };
  if (!champInfo) return null;

  const champInfoURL = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${champInfo.name}/splashCentered`;
  return (
    <div className="fixed top-[20%] inset-x-0 flex items-center justify-center">
      <div
        className="flex flex-col items-center transition-all duration-500 ease-in-out"
        style={getAnimationStyles(champInfo.name)}
      >
        <img
          src={champInfoURL}
          alt={champInfo.displayName || champInfo.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-64 object-contain mb-4 shadow-black z-10 rounded-md border-2 border-gray`}
        />
        <h2 className="text-3xl font-bold z-10">{champInfo.displayName || champInfo.name}</h2>
        <div className="absolute -inset-7 blur-lg bg-zinc-950 w-[112%] h-[112%]"></div>
      </div>
    </div>
  );
};

export default BanBox;
