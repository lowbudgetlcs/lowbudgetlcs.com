import { ParticipantDto } from "../interfaces/MatchV5";
import summonerSpells from "../json/summoner-spells.json";
import { useState } from "react";
import DisplayRuneImage from "./RuneDisplay/DisplayRuneImage";
import DisplayRuneSetImage from "./RuneDisplay/DisplayRuneSetImage";
import ShowAllRuneImages from "./RuneDisplay/ShowAllRuneImages";
import DisplayAllStatMods from "./RuneDisplay/DisplayStatMods";
const PlayerContainer = ({ playerData }: { playerData: ParticipantDto }) => {
  const [runesShown, setRunesShown] = useState<boolean>(false);

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
          <div
            className="runes flex flex-col items-center gap-2"
            onMouseEnter={() => setRunesShown(true)}
            onMouseLeave={() => setRunesShown(false)}>
            <div className="relative">
              <img src={primaryRuneLink} className="w-6 h-6"></img>
            </div>
            <div className="relative">
              <img src={secondaryRuneSetLink} className="w-6 h-6"></img>
              <div
                className={`absolute w-fit top-6 -left-9 z-10 bg-black ${
                  runesShown ? "animate-fadeIn" : "hidden"
                } flex flex-col gap-2 min-w-24 items-center justify-center text-center p-2 rounded-md border-2 border-gray/40`}>
                <img src={primaryRuneLink} className="w-8 h-8"></img>
                <div className="flex">
                  {ShowAllRuneImages(playerData, "primaryStyle", 1).map((link) => {
                    return <img src={link} key={link} className="w-6 h-6"></img>;
                  })}
                </div>
                <div className="flex">
                  {ShowAllRuneImages(playerData, "subStyle", 0).map((link) => {
                    return <img src={link} key={link} className="w-6 h-6"></img>;
                  })}
                </div>
                <div className="flex gap-0.5">
                  {DisplayAllStatMods(playerData).map((link, index) => {
                    return (
                      <img
                        src={link}
                        key={index}
                        className="w-6 h-6 border-2 rounded-full border-gray"></img>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerContainer;
