import { memo, useEffect, useState } from "react";
import tempImage from "../../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "../draftInterfaces";
import { usePastDraftContext } from "../providers/DraftProvider";

const StreamPickImage = ({
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
  const [link, setLink] = useState<string | undefined>(undefined);

  const { isPastDraft } = usePastDraftContext();

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
        // Fixes Wukong's name
        const fixedName =
          currentHover.toLowerCase() === "wukong" ? "monkeyKing" : currentHover;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/portrait`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    } else {
      setLink((prevLink) => {
        // Fixes Wukong's name
        const fixedName =
          championName.toLowerCase() === "wukong" ? "monkeyKing" : championName;
        const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/portrait`;
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
        className="w-full grayscale opacity-25"
      />
    );
  } else if (championName !== "nothing" || isChampHovered) {
    return (
      <div className="relative w-full h-full">
        <img
          src={link ? link : "#"}
          alt={displayName || "champion image"}
          className={`w-full h-full object-cover ${
            isChampHovered ? "grayscale-[90%]" : ""
          } ${
            championName !== "nothing" && !isPastDraft && "animate-smallScaleBounce"
          } scale-105`}
        />
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

export default memo(StreamPickImage);
