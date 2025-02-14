import { memo, useEffect, useState } from "react";
import tempImage from "../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "./draftInterfaces";

const DisplayPickImage = ({
  playerSide,
  pickIndex,
  pickedChampions,
  championRoles,
  currentHover,
}: {
  playerSide: string;
  pickIndex: number;
  pickedChampions: string[];
  championRoles: Champion[];
  currentHover: DraftProps["currentHover"];
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const delay: number = 20;

  useEffect(() => {
    setTimeout(() => setMounted(true), delay);
  });

  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

  // Check if the current slot should show the hovered champion
  const isChampHovered =
    pickedChampions.length === pickIndex &&
    currentHover &&
    championName === "nothing";

  const selectedChampion = championRoles.find(
    (champion) => champion.name.toLowerCase() === championName
  );
  const selectedHoveredChampion = championRoles.find(
    (champion) => champion.name.toLowerCase() === currentHover?.toLowerCase()
  );

  const displayName = selectedChampion?.displayName;
  const hoveredDisplayName = selectedHoveredChampion?.displayName;

  if (isChampHovered) {
    return (
      mounted && (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${
              currentHover === "Wukong" ? "monkeyking" : currentHover
            }/splash-art/centered')`,
          }}
          className="relative w-full h-full bg-[51%_20%] bg-[size:180%] grayscale-[90%]"
        >
          <p
            className={
              playerSide === "blue"
                ? "absolute bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md"
                : "absolute bottom-0 left-0 font-bold bg-black px-2 rounded-tr-md"
            }
          >
            {hoveredDisplayName}
          </p>
        </div>
      )
    );
  }

  if (pickedChampions[pickIndex] === "nothing") {
    return (
      mounted && (
        <img
          src={tempImage}
          alt="nothing"
          className=" max-w-full max-h-full grayscale scale-[180%] opacity-25 m-auto"
        />
      )
    );
  } else if (championName !== "nothing") {
    return (
      mounted && (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${
              championName === "wukong" ? "monkeyking" : championName
            }/splash-art/centered')`,
          }}
          className="relative w-full h-full bg-[51%_20%] bg-[size:180%]"
        >
          <p
            className={
              playerSide === "blue"
                ? "absolute bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md"
                : "absolute bottom-0 left-0 font-bold bg-black px-2 rounded-tr-md"
            }
          >
            {displayName}
          </p>
        </div>
      )
    );
  } else {
    return null;
  }
};

export default memo(DisplayPickImage);
