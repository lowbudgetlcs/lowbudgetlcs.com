import { memo } from "react";
import tempImage from "../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "../draftInterfaces";

const StreamPickImages = ({
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

  const displayName = isChampHovered
    ? selectedHoveredChampion?.displayName
    : selectedChampion?.displayName;
  const champURLName = isChampHovered
    ? currentHover === "Wukong"
      ? "monkeyking"
      : currentHover
    : championName === "wukong"
    ? "monkeyking"
    : championName;

  const displayImage = `url('https://cdn.communitydragon.org/latest/champion/${champURLName}/splash-art/centered')`;
  if (isChampHovered || championName !== "nothing") {
    return (
      <div
        style={{
          backgroundImage: displayImage,
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
          {displayName}
        </p>
      </div>
    );
  }

  if (pickedChampions[pickIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        className=" max-w-full max-h-full grayscale scale-[180%] opacity-25 m-auto"
      />
    );
  } else {
    return null;
  }
};

export default memo(StreamPickImages);
