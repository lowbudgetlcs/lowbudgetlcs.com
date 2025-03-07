import { memo } from "react";
import tempImage from "../../assets/Transparent_LBLCS_Logo.png";
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
    // Check if the current slot should show the hovered champion
    const isChampHovered = bannedChampions.length === banIndex && currentHover;
  
    const championName = bannedChampions[banIndex]
      ? bannedChampions[banIndex].toLowerCase()
      : "nothing";
  
      if (isChampHovered) {
        return (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${currentHover === "wukong" ? "monkeyking" : currentHover}/splash-art/centered')`,
          }}
          className={`relative w-full h-full bg-[51%_20%] bg-[size:420%] grayscale-[90%]`}
        ></div>
        );
      }
    
  
    if (bannedChampions[banIndex] === "nothing") {
      return (
        <img
          src={tempImage}
          alt="nothing"
          width="160px"
          height="200px"
          className="object-cover"
        />
      );
    } else if (championName !== "nothing") {
      return (
        <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${championName === "wukong" ? "monkeyking" : championName}/tile')`,
          }}
          className={`relative w-full h-full bg-cover scale-110`}
        ></div>
      );
    }
  };
  
  export default memo(DisplayBanImage)