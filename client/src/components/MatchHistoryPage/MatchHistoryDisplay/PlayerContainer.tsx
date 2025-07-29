import { ParticipantDto } from "../interfaces/MatchV5";
import runes from "../json/perks.json";
import summonerSpells from "../json/summoner-spells.json";
import runeSets from "../json/perkstyles.json";
import { useState } from "react";
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
  const rawPrimaryRune = playerData.perks.styles.find(
    (style) => style.description === "primaryStyle"
  );
  const rawSecondaryRune = playerData.perks.styles.find(
    (style) => style.description === "subStyle"
  );
  const primaryRune = runes.find((rune) => rune.id === rawPrimaryRune?.selections[0].perk);
  const secondaryRuneSet = runeSets.styles.find((rune) => rune.id === rawSecondaryRune?.style);
  const correctedPrimaryRune = primaryRune?.iconPath.replace(" ", "_").toLowerCase();
  const correctedSecondaryRuneSet = secondaryRuneSet?.iconPath.replace(" ", "_").toLowerCase();
  const primaryRuneLink = `https://raw.communitydragon.org${correctedPrimaryRune}`;
  const secondaryRuneSetLink = `https://raw.communitydragon.org${correctedSecondaryRuneSet}`;

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
            <div className="relative">
              <img
                onMouseEnter={() => setPrimaryRumeShown(true)}
                onMouseLeave={() => setPrimaryRumeShown(false)}
                src={primaryRuneLink}
                className="w-6 h-6"></img>
              <div className={`absolute ${primaryRumesShown ? "" : "hidden"}`}></div>
            </div>
            <div className="relative">
              <img
                onMouseEnter={() => setSecondaryRumeShown(true)}
                onMouseLeave={() => setSecondaryRumeShown(false)}
                src={secondaryRuneSetLink}
                className="w-6 h-6"></img>
              <div className={`absolute ${secondaryRumesShown ? "" : "hidden"}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerContainer;
