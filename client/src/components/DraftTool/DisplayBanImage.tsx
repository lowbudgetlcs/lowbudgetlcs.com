import { memo, useEffect, useState } from "react";
import tempImage from "../../assets/lblcsLogo.svg";
import { DraftProps } from "./draftInterfaces";

const DisplayBanImage = ({
  banIndex,
  bannedChampions,
  currentHover,
}: {
  banIndex: number;
  bannedChampions: string[];
  currentHover: DraftProps["currentHover"];
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const delay: number = 20;

  useEffect(() => {
    setTimeout(() => setMounted(true), delay);
  });

  // Check if the current slot should show the hovered champion
  const isChampHovered = bannedChampions.length === banIndex && currentHover;

  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";

  if (isChampHovered) {
    return (
      mounted && (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${
              currentHover === "Wukong" ? "monkeyking" : currentHover
            }/tile')`,
          }}
          className={`relative w-full h-full bg-cover grayscale-[90%]`}
        ></div>
      )
    );
  }

  if (bannedChampions[banIndex] === "nothing") {
    return (
      mounted && (
        <img
          src={tempImage}
          alt="nothing"
          width="160px"
          height="200px"
          className="object-cover scale-90 grayscale opacity-25"
        />
      )
    );
  } else if (championName !== "nothing") {
    return (
      mounted && (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${
              championName === "Wukong" ? "monkeyking" : championName
            }/tile')`,
          }}
          className={`relative w-full h-full bg-cover`}
        ></div>
      )
    );
  }
};

export default memo(DisplayBanImage);
