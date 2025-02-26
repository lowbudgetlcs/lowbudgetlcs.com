import { memo } from "react";
import tempImage from "../../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "../draftInterfaces";

const StreamPickImage = ({
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

  const selectedChampion = championRoles.find((champion) =>
    currentHover
      ? champion.name.toLowerCase() === currentHover?.toLowerCase()
      : championName !== "nothing" &&
        champion.name.toLowerCase() === championName
  );

  const displayName = selectedChampion?.displayName;

  if (pickedChampions[pickIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        className=" max-w-full max-h-full grayscale scale-[180%] opacity-25 m-auto"
      />
    );
  } else if (championName !== "nothing" || isChampHovered) {
    return (
      <div
        style={{
          backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${
            championName === "wukong" ? "monkeyking" : championName
          }/splash-art/centered')`,
        }}
        className={`relative w-full h-full bg-[51%_20%] bg-[size:180%] ${
          isChampHovered && " grayscale-[90%]"
        }`}
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
  } else {
    return null;
  }
};

export default memo(StreamPickImage);
