import tempImage from "../../assets/Transparent_LBLCS_Logo.png";

const dDragonLargeImageLink =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/";

const cDragonCDNSplashLink = `https://cdn.communitydragon.org/15.2.1/champion/`;

export const DisplayBanImage = (
  banIndex: number,
  bannedChampions: string[]
) => {
  const championName = bannedChampions[banIndex]
    ? bannedChampions[banIndex].toLowerCase()
    : "nothing";
  const correctChampionImageLinks = () => {
    let link = `${dDragonLargeImageLink}${championName}/skins/base/${championName}loadscreen.jpg`;
    switch (championName) {
      case "naafiri":
      case "milio":
        link = `${dDragonLargeImageLink}${championName}/skins/base/${championName}loadscreen_0.jpg`;
        break;
      case "ambessa":
        link = `${dDragonLargeImageLink}${championName}/skins/base/${championName}loadscreen_0.domina.jpg`;
        break;
      case "hwei":
        link = `${dDragonLargeImageLink}${championName}/skins/skin0/${championName}loadscreen_0.jpg`;
        break;
      case "aurora":
      case "mel":
        link = `${dDragonLargeImageLink}${championName}/skins/base/${championName}loadscreen_0.${championName}.jpg`;
        break;
    }

    return link;
  };
  if (bannedChampions[banIndex] === "nothing") {
    return (
      <img
        src={tempImage}
        alt={`nothing`}
        style={{
          width: "160px",
          height: "200px",
          objectFit: "cover",
        }}
      />
    );
  } else {
    return (
      <>
        {bannedChampions[banIndex] && (
          <img
            src={correctChampionImageLinks()} //largeChampImages[bannedChampions[banIndex]]
            alt={`${bannedChampions[banIndex]}`}
            style={{
              width: "160px",
              height: "200px",
              objectFit: "cover",
            }}
          />
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
    switch (championName) {
      case "naafiri":
      case "milio":
        link = `${cDragonCDNSplashLink}${championName}/splash-art/centered`;
        break;
      case "ambessa":
        link = `${cDragonCDNSplashLink}${championName}/splash-art/centered`;
        break;
      case "hwei":
        link = `${cDragonCDNSplashLink}${championName}/splash-art/centered`;
        break;
      case "aurora":
      case "mel":
        link = `${cDragonCDNSplashLink}${championName}/splash-art/centered`;
        break;
    }
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
            className="max-w-full max-h-full object-cover"
            width={"300px"}
            height={"90px"}
          />
        )}
      </>
    );
  }
};
