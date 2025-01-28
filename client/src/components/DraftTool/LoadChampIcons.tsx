import { useMemo } from "react";
import { Champion } from "./draftInterfaces";

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
  const dDragonIconLink =
    "https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/";
  const handlePick = (championName: string) => {
    if (
      !pickedChampions.includes(championName) &&
      !bannedChampions.includes(championName)
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
          >
            <img
              className={`
            ${
              pickedChampions.includes(champion.name) ||
              bannedChampions.includes(champion.name)
                ? "grayscale"
                : "hover:cursor-pointer"
            } 
            ${
              chosenChamp === champion.name
                ? `box-border border-orange border-2 ${
                    champion.name === "Katarina" ||
                    champion.name === "Garen" ||
                    champion.name === "Samira"
                      ? "animate-spin"
                      : champion.name === "Zac"
                      ? "animate-bounce"
                      : "animate-pulse"
                  }`
                : ""
            }`}
              src={`${dDragonIconLink}${
                champion.name === "Wukong" ? "MonkeyKing" : champion.name
              }.png`}
              alt={champion.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
              }}
            />
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

// export function LoadLargeChampImages (

// )
export default LoadChampIcons;
