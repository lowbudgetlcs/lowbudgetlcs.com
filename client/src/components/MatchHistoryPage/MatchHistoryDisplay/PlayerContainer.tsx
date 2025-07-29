import { ParticipantDto } from "../interfaces/MatchV5";
import summonerSpells from "../json/summoner-spells.json";
import { useState } from "react";
import DisplayRuneImage from "./DisplayRuneImage";
import DisplayRuneSetImage from "./DisplayRuneSetImage";
const PlayerContainer = ({ playerData }: { playerData: ParticipantDto }) => {
  const [primaryRumesShown, setPrimaryRumeShown] = useState<boolean>(false);
  const [secondaryRumesShown, setSecondaryRumeShown] = useState<boolean>(false);

  const championLink = `https://cdn.communitydragon.org/latest/champion/${playerData.championId}/square`;
  // Find image links for summoner spells
  const summoner1 = summonerSpells.find((spell) => spell.id === playerData.summoner1Id);
  const summoner2 = summonerSpells.find((spell) => spell.id === playerData.summoner2Id);
  const correctedSummoner1 = summoner1?.iconPath.replace(" ", "_").toLowerCase();
  const correctedSummoner2 = summoner2?.iconPath.replace(" ", "_").toLowerCase();
  const summoner1Link = `https://raw.communitydragon.org${correctedSummoner1}`;
  const summoner2Link = `https://raw.communitydragon.org${correctedSummoner2}`;

  //   Find image links for runes
  const primaryRuneLink = DisplayRuneImage(playerData, 0, "primaryStyle");
  const secondaryRuneSetLink = DisplayRuneSetImage(playerData);

  const ShowAllRuneImages = (styleType: string, initialInt: number) => {
    const links: string[] = [];
    if (styleType === "primaryStyle") {
      for (let i = initialInt; i < 4; i++) {
        const runeToPush = DisplayRuneImage(playerData, i, "primaryStyle");
        if (runeToPush) {
          links.push(runeToPush);
        }
      }
    } else {
      for (let i = initialInt; i < 2; i++) {
        const runeToPush = DisplayRuneImage(playerData, i, "subStyle");
        if (runeToPush) {
          links.push(runeToPush);
        }
      }
    }
    return links;
  };
  return (
    <div className="playerContainer flex gap-2 items-center">
      <div className="champPlayerInfo flex gap-2 items-center justify-around">
        <div className="champImage relative w-12 h-12">
          <img src={championLink} alt={` ${playerData.championName}`} />
          <p className="absolute bottom-0 right-0 text-xs rounded-md bg-black px-0.5">
            {playerData.champLevel}
          </p>
        </div>
        <div className="playerInfo flex flex-col">
          <p className="playerName">{playerData.riotIdGameName}</p>
          <p className="playerRank text-white/60 text-sm">
            {playerData.teamPosition === "UTILITY" ? "SUPPORT" : playerData.teamPosition}
          </p>
        </div>
        <div className="playerBuild flex gap-2">
          <div className="summonerSpells flex flex-col items-center gap-2">
            <img src={summoner1Link} className="w-6 h-6"></img>
            <img src={summoner2Link} className="w-6 h-6"></img>
          </div>
          <div className="runes flex flex-col items-center gap-2">
            <div
              onMouseEnter={() => setPrimaryRumeShown(true)}
              onMouseLeave={() => setPrimaryRumeShown(false)}
              className="relative">
              <img src={primaryRuneLink} className="w-6 h-6"></img>
              <div
                className={`absolute -top-14 bg-black ${
                  primaryRumesShown ? "" : "hidden"
                } grid grid-cols-2 gap-2`}></div>
            </div>
            <div
              onMouseEnter={() => setSecondaryRumeShown(true)}
              onMouseLeave={() => setSecondaryRumeShown(false)}
              className="relative">
              <img src={secondaryRuneSetLink} className="w-6 h-6"></img>
              <div className={`absolute -top-14 bg-black ${secondaryRumesShown ? "" : "hidden"}`}>
                {ShowAllRuneImages("primaryStyle", 1).map((link) => {
                  return <img src={link} key={link} className="w-6 h-6"></img>;
                })}
                {ShowAllRuneImages("subStyle", 0).map((link) => {
                  return <img src={link} key={link} className="w-6 h-6"></img>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerContainer;
