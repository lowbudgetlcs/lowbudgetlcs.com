import tempImage from "../../assets/Transparent_LBLCS_Logo.png";

const dDragonLargeImageLink =
  `https://cdn.communitydragon.org/15.2.1/champion/`;

const cDragonCDNSplashLink = `https://cdn.communitydragon.org/15.2.1/champion/`;

export const DisplayBanImage = (
  banIndex: number,
  bannedChampions: string[]
) => {
  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";
    const championLink = `${dDragonLargeImageLink}${championName}/splash-art/centered`;
  console.log("championLink: ", championLink)
  if (bannedChampions[banIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt={`nothing`}
        width={"160px"}
        height={"200px"}
        className="object-cover"
      />
    );
  } else {
    return (
      <>
        {bannedChampions[banIndex] && (
          <div
          style={{
            backgroundImage: `url('https://cdn.communitydragon.org/15.2.1/champion/${championName}/splash-art/centered')`
          }}
            className={`bg-cover h-20 w-20 z-10  bg-[url('https://cdn.communitydragon.org/15.2.1/champion/${championName}/splash-art/centered')]`}
          ></div>
        )}
      </>
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
