import tempImage from "../../assets/Transparent_LBLCS_Logo.png";

export const DisplayBanImage = (
  banIndex: number,
  bannedChampions: string[]
) => {
  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";

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
        className={`w-full h-full bg-[51%_20%] bg-[size:420%]`}
      ></div>
    );
  }
};
export const DisplayPickImage = (
  pickIndex: number,
  pickedChampions: string[]
) => {
  const championName = pickedChampions[pickIndex]
    ? pickedChampions[pickIndex].toLowerCase()
    : "nothing";

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
            className="w-full h-full bg-[51%_20%] bg-[size:180%]"
          ></div>
        )}
      </>
    );
  }
};
