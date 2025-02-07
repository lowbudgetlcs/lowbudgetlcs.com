import tempImage from "../../assets/Transparent_LBLCS_Logo.png";

const cDragonCDNSplashLink = `https://cdn.communitydragon.org/15.2.1/champion/`;

export const DisplayBanImage = (banIndex: number, bannedChampions: string[]) => {

  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";


  if (!bannedChampions[banIndex] || bannedChampions[banIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt="nothing"
        width="160px"
        height="200px"
        className="object-cover"
      />
    );
  } else {
    return (
      <div
      style={{
        backgroundImage: `url('https://cdn.communitydragon.org/15.2.1/champion/${championName}/splash-art/centered')`
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

  const correctChampionImageLinks = () => {
    let link = `${cDragonCDNSplashLink}${championName}/splash-art/centered`;
    return link;
  };

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
  } else {
    return (
      <>
        {pickedChampions[pickIndex] && (
          <img
            src={correctChampionImageLinks()} //largeChampImages[pickedChampions[pickIndex]]
            alt={`${pickedChampions[pickIndex]}`}
            className="max-w-full max-h-full object-cover scale-150"
            width={"300px"}
            height={"90px"}
          />
        )}
      </>
    );
  }
};
