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
  const [link, setLink] = useState<string>("");

  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";

  // Check if the current slot should show the hovered champion
  const isChampHovered =
    bannedChampions.length === banIndex &&
    currentHover &&
    championName === "nothing";

  useEffect(() => {
    if (isChampHovered) {
      setLink((prevLink) => {
        const fixedName =
          currentHover.toLowerCase() === "wukong" ? "monkeyKing" : currentHover;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/tile`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    } else {
      setLink((prevLink) => {
        const fixedName =
          championName.toLowerCase() === "wukong" ? "monkeyKing" : championName;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/tile`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    }
  }, [currentHover, championName]);

  if (bannedChampions[banIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        width="160px"
        height="200px"
        className="object-cover scale-90 grayscale opacity-25"
      />
    );
  } else if (championName !== "nothing" || isChampHovered) {
    return (
      <div className={`relative w-full h-full`}>
        <img
          src={link ? link : "#"}
          className={`w-full h-full object-cover grayscale-[90%]`}
        />
        <div
          className={`banLine1 absolute w-full h-1 top-1/2 bg-red/80 rounded-md opacity-0 ${
            championName !== "nothing" && "animate-line1X"
          }`}
        ></div>
        <div
          className={`banLline2 absolute w-full h-1 bg-red/80 top-1/2 rounded-md opacity-0 ${
            championName !== "nothing" && "animate-line2X"
          }`}
        ></div>
      </div>
    );
  }
};

export default memo(DisplayBanImage);
