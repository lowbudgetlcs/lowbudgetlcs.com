import { memo, useEffect, useState } from "react";
import tempImage from "../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "./draftInterfaces";
import { useDraftContext } from "./providers/DraftProvider";

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
  const [link, setLink] = useState<string>("");

  const { isPastDraft } = useDraftContext();

  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

  // Check if the current slot should show the hovered champion
  const isChampHovered =
    pickedChampions.length === pickIndex &&
    currentHover &&
    championName === "nothing";

  useEffect(() => {
    if (isChampHovered) {
      setLink((prevLink) => {
        const fixedName =
          currentHover.toLowerCase() === "wukong" ? "monkeyKing" : currentHover;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/splash-art/centered`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    } else {
      setLink((prevLink) => {
        const fixedName =
          championName.toLowerCase() === "wukong" ? "monkeyKing" : championName;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/splash-art/centered`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    }
  }, [currentHover, championName]);

  const selectedChampion = championRoles.find((champion) =>
    currentHover && championName === "nothing"
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
      <div className={`relative w-full h-full`}>
        <img
          src={link ? link : "#"}
          alt={displayName || "champion image"}
          className={`w-full h-full object-cover object-[50%_-20%] scale-[180%] ${
            isChampHovered ? "grayscale-[90%]" : ""
          } ${
            championName !== "nothing" && !isPastDraft && "animate-scaleBounce"
          }`}
        />
        <p
          className={
            playerSide === "blue"
              ? "absolute z-50 bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md"
              : "absolute z-50 bottom-0 left-0 font-bold bg-black px-2 rounded-tr-md"
          }
        >
          {displayName}
        </p>
        <div
          className={`absolute top-0 right-[150%] w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-90 blur-2xl ${
            championName !== "nothing" && !isPastDraft && "animate-moveToRight"
          }`}
        ></div>
      </div>
    );
  } else {
    return null;
  }
};

export default memo(DisplayPickImage);
