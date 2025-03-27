import { useMemo } from "react";
import { Champion } from "./draftInterfaces";
import { useSocketContext } from "./DraftPage";

interface LoadChampIconsProps {
  championRoles: Champion[];
  searchValue: string;
  selectedRole: string;
  pickedChampions: string[];
  bannedChampions: string[];
  chosenChamp?: string;
  setChosenChamp: (championName: string) => void;
}

export function LoadChampIcons({
  championRoles,
  searchValue,
  selectedRole,
  pickedChampions,
  bannedChampions,
  chosenChamp,
  setChosenChamp,
}: LoadChampIconsProps) {
  const dDragonIconLink = `https://cdn.communitydragon.org/latest/champion/`;
  const { socket } = useSocketContext();
  const handlePick = (championName: string) => {
    if (
      !pickedChampions.includes(championName) &&
      !bannedChampions.includes(championName) &&
      socket //This will stop users from selecting champions on finished drafts
    ) {
      setChosenChamp(championName);
    }
  };

  const championList = useMemo(() => {
    return championRoles
      .filter((champion) => {
        const matchesSearch = champion.name
          .toLowerCase()
          .includes(searchValue.toLowerCase());

        if (selectedRole === "All") {
          return matchesSearch;
        }

        const selectedChampion = championRoles.find(
          (champ) => champ.name === champion.name
        );
        if (!selectedChampion) return false;

        const hasSelectedRole = champion.roles.includes(selectedRole);

        return matchesSearch && hasSelectedRole;
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
                pickedChampions.includes(champion.name) ||
                bannedChampions.includes(champion.name)
                  ? ""
                  : "hover:scale-105"
              } 
              ${
                chosenChamp === champion.name &&
                "scale-105 border-orange"
              }
              `}
          >
            <img
              className={`
            ${
              pickedChampions.includes(champion.name) ||
              bannedChampions.includes(champion.name)
                ? "grayscale"
                : "hover:cursor-pointer group-hover:brightness-110"
            } 
            ${
              chosenChamp === champion.name
                ? `brightness-110 ${
                    champion.name === "Katarina" ||
                    champion.name === "Garen" ||
                    champion.name === "Samira" ||
                    champion.name === "Wukong"
                      ? "animate-spin"
                      : champion.name === "Zac"
                      ? "animate-bounce"
                      : "animate-pulse"
                  }`
                : ""
            }
            w-28 object-contain max-[1100px]:w-24 select-none rounded-md`}
              src={`${dDragonIconLink}${
                champion.name === "Wukong" ? "monkeyking" : champion.name
              }/square`}
              alt={champion.name}
            />
            <p
              className={`text-center ${
                pickedChampions.includes(champion.name) ||
                bannedChampions.includes(champion.name)
                  ? ""
                  : "hover:cursor-pointer"
              } select-none`}
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
    handlePick,
  ]);

  return <>{championList}</>;
}

export default LoadChampIcons;
