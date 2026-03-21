import { memo, useEffect, useState } from "react";
import tempImage from "../../../../assets/lblcsLogo.svg";
import { Champion, DraftProps } from "../../interfaces/draftInterfaces";
import { useDraftContext } from "../../providers/DraftProvider";
import { useSettingsContext } from "../../providers/SettingsProvider";

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
  const { pickNamesVisible } = useSettingsContext();
  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

  // Check if the current slot should show the hovered champion
  const isChampHovered =
    pickedChampions.length === pickIndex &&
    currentHover &&
    championName === "nothing";

  useEffect(() => {
    if (isChampHovered && currentHover) {
      setLink((prevLink) => {
        const fixedName =
          currentHover.toLowerCase() === "wukong" ? "monkeyKing" : currentHover;
        const imageURL = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/splashCentered`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    } else {
      setLink((prevLink) => {
        const fixedName =
          championName.toLowerCase() === "wukong" ? "monkeyKing" : championName;
        const imageURL = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/splashCentered`;
        if (imageURL !== prevLink) {
          return imageURL;
        }
        return prevLink;
      });
    }
  }, [currentHover, championName, isChampHovered]);

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
        {link && (
          <img
            src={link}
            alt={displayName || "champion image"}
            className={`w-full h-full object-cover object-[50%_-20%] draftMd:object-[50%_4%] scale-[180%] min-[1922px]:scale-[140%] ${
              isChampHovered ? "grayscale-90" : ""
            } ${
              championName !== "nothing" &&
              !isPastDraft &&
              "animate-scaleBounce min-[1922px]:animate-largeScreenScaleBounce"
            }`}
          />
        )}
        <div
          className={`absolute bottom-0 w-full font-bold min-[1922px]:text-2xl`}
        >
          <div
            className={`relative  ${
              !isChampHovered || isPastDraft ? "" : "hidden"
            }  ${pickNamesVisible ? "" : "hidden"}`}
          >
            <div
              className={`absolute -bottom-2 h-8 min-[1922px]:h-10 w-2/5 animate-fadeIn from-black ${
                playerSide === "blue"
                  ? "bg-linear-to-l right-0"
                  : "bg-linear-to-r"
              }`}
            ></div>
            <div
              className={`absolute bottom-0 px-2 ${
                playerSide === "blue" ? "right-0" : "left-0"
              } 
              ${
                !isPastDraft &&
                (playerSide === "blue"
                  ? "opacity-0 animate-slide-in-right"
                  : "opacity-0 animate-slide-in-left")
              }`}
            >
              {displayName}
            </div>
          </div>
        </div>
        <div
          className={`absolute top-0 right-[150%] w-full h-full bg-linear-to-br from-transparent via-white to-transparent opacity-90 blur-2xl ${
            championName !== "nothing" && !isPastDraft && "animate-moveToRight"
          }`}
        ></div>
      </div>
    );
  }
  return null;
};

export default memo(DisplayPickImage);
