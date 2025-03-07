import { memo } from "react";
import tempImage from "../../assets/Transparent_LBLCS_Logo.png";
import { Champion, DraftProps } from "./draftInterfaces";


const DisplayPickImage = ({
  pickIndex,
  pickedChampions,
  championRoles,
  currentHover,
}: {
  pickIndex: number;
  pickedChampions: string[];
  championRoles: Champion[];
  currentHover: DraftProps["currentHover"];
}) => {
  // Check if the current slot should show the hovered champion
  const isChampHovered = pickedChampions.length === pickIndex && currentHover;

  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

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
      <div
        style={{
          backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${currentHover}/splash-art/centered')`,
        }}
        className="relative w-full h-full bg-[51%_20%] bg-[size:180%] grayscale-[90%]"
      >
        <p className="absolute bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md">
          {hoveredDisplayName}
        </p>
      </div>
    );
  }

  if (pickedChampions[pickIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        className="object-cover max-w-full max-h-full"
        width={"300px"}
        height={"90px"}
      />
    );
  } else if (championName !== "nothing") {
    return (
      <div
        style={{
          backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${championName}/splash-art/centered')`,
        }}
        className="relative w-full h-full bg-[51%_20%] bg-[size:180%]"
      >
        <p className="absolute bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md">
          {displayName}
        </p>
      </div>
    );
  } else {
    return null;
  }
};

export default memo(DisplayPickImage)