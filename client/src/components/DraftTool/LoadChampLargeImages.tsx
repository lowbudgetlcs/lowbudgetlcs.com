import tempImage from "../../assets/Transparent_LBLCS_Logo.png";
import { Champion } from "./draftInterfaces";

export const DisplayBanImage = (
  banIndex: number,
  bannedChampions: string[],
  // championRoles: Champion[]
) => {
  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";

  // const selectedChampion = championRoles.find(
  //   (champion) => champion.name.toLowerCase() === championName
  // );
  // const displayName = selectedChampion?.displayName;

  if (bannedChampions[banIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        width="160px"
        height="200px"
        className="object-cover"
      />
    );
  } else if (championName !== "nothing") {
    return (
      <div
        style={{
          backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${championName}/splash-art/centered')`,
        }}
        className={`relative w-full h-full bg-[51%_20%] bg-[size:420%]`}
      >
      </div>
    );
  }
};

export const DisplayPickImage = (
  pickIndex: number,
  pickedChampions: string[],
  championRoles: Champion[]
) => {
  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

  const selectedChampion = championRoles.find(
    (champion) => champion.name.toLowerCase() === championName
  );
  const displayName = selectedChampion?.displayName;

  if (pickedChampions[pickIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt={`nothing`}
        className="object-cover max-w-full max-h-full"
        width={"300px"}
        height={"90px"}
      />
    );
  } else if (championName !== "nothing") {
    return (
      <>
        {pickedChampions[pickIndex] && (
          <div
            style={{
              backgroundImage: `url('https://cdn.communitydragon.org/latest/champion/${championName}/splash-art/centered')`,
            }}
            className="relative w-full h-full bg-[51%_20%] bg-[size:180%]"
          >
            <p className="absolute bottom-0 right-0 font-bold bg-black px-2 rounded-tl-md">{displayName}</p>
          </div>
        )}
      </>
    );
  }
};
