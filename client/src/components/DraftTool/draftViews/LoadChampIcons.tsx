import { useCallback, useMemo } from "react";
import { Champion } from "../interfaces/draftInterfaces";
import { useDraftContext } from "../providers/DraftProvider";
import { useSettingsContext } from "../providers/SettingsProvider";

interface LoadChampIconsProps {
  championRoles: Champion[];
  searchValue: string;
  selectedRole: string;
}

export function LoadChampIcons({
  championRoles,
  searchValue,
  selectedRole,
}: LoadChampIconsProps) {
  const { draftState, chosenChamp, setChosenChamp, draftSocket } =
    useDraftContext();
  const pickedChampions = draftState.picksArray;
  const bannedChampions = draftState.bansArray;
  const { smallIcons, champNamesVisible } = useSettingsContext();
  const dDragonIconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;
  const nothingIconLink =
    "https://raw.communitydragon.org/10.1/plugins/rcp-fe-lol-item-sets/global/default/icon-helmet.png";
  const { animationToggle } = useSettingsContext();
  const handlePick = useCallback(
    (championName: string) => {
      if (
        (!pickedChampions.includes(championName) &&
          !bannedChampions.includes(championName)) ||
        championName === "nothing"
        //This will stop users from selecting champions on finished drafts
      ) {
        if (draftSocket) {
          setChosenChamp(championName);
        }
      }
    },
    [bannedChampions, draftSocket, pickedChampions, setChosenChamp]
  );

  const championList = useMemo(() => {
    return championRoles
      .filter((champion) => {
        const trimmedChamp = champion.name.toLowerCase().trim();
        const matchesSearch = trimmedChamp.includes(
          searchValue.toLowerCase().trim()
        );
        const trimmedDisplayChamp = champion.displayName.toLowerCase().trim();
        const matchesDisplay = trimmedDisplayChamp.includes(
          searchValue.toLowerCase().trim()
        );
        const splitString = trimmedChamp.split(" ");
        const includesInitials = splitString.some((word) =>
          word.startsWith(searchValue.toLowerCase().trim())
        );
        if (selectedRole === "All") {
          return matchesSearch || matchesDisplay || includesInitials;
        }

        const selectedChampion = championRoles.find(
          (champ) => champ.name === champion.name
        );
        if (!selectedChampion) return false;

        const hasSelectedRole = champion.roles.includes(selectedRole);

        return (
          (matchesSearch || includesInitials || matchesDisplay) &&
          hasSelectedRole
        );
      })
      .map((champion) => {
        return (
          <li
            key={champion.name}
            onClick={() => {
              handlePick(champion.name);
            }}
            className={`border-2 border-gray rounded-md transition duration-75 ease-linear bg-black group
              ${
                (pickedChampions.includes(champion.name) ||
                  bannedChampions.includes(champion.name)) &&
                champion.name !== "nothing"
                  ? ""
                  : "hover:scale-105"
              } 
              ${chosenChamp === champion.name && "scale-105 border-orange"}
              `}
          >
            <img
              className={`
            ${
              (pickedChampions.includes(champion.name) ||
                bannedChampions.includes(champion.name)) &&
              champion.name !== "nothing"
                ? "grayscale"
                : "hover:cursor-pointer group-hover:brightness-110"
            } 
            ${
              chosenChamp === champion.name
                ? `brightness-110 ${
                    animationToggle &&
                    (champion.name === "Katarina" ||
                    champion.name === "Garen" ||
                    champion.name === "Samira" ||
                    champion.name === "Wukong"
                      ? "animate-spin"
                      : champion.name === "Zac"
                      ? "animate-bounce"
                      : "animate-pulse")
                  }`
                : ""
            }
            ${
              smallIcons ? "w-20" : "w-28"
            } object-contain max-[1100px]:w-24 select-none rounded-md ${champion.name === "nothing" && 'border-4 border-black'}`}
              src={
                champion.name === "nothing"
                  ? nothingIconLink
                  : `${dDragonIconLink}${
                      champion.name === "Wukong" ? "monkeyking" : champion.name
                    }/square`
              }
              alt={champion.name}
            />
            <p
              className={`text-center ${
                (pickedChampions.includes(champion.name) ||
                  bannedChampions.includes(champion.name)) &&
                champion.name !== "nothing"
                  ? ""
                  : "hover:cursor-pointer"
              } select-none ${smallIcons ? "text-xs" : "text-sm font-bold"} ${
                champNamesVisible ? "" : "hidden"
              }`}
            >
              {champion.displayName}
            </p>
          </li>
        );
      });
  }, [
    championRoles,
    searchValue,
    selectedRole,
    pickedChampions,
    bannedChampions,
    dDragonIconLink,
    chosenChamp,
    handlePick
  ]);

  return <>{championList}</>;
}

export default LoadChampIcons;
