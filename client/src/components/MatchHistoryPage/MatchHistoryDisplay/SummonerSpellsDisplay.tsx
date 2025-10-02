import { ParticipantDto } from "../../../types/MatchV5";
import summonerSpells from "../json/summoner-spells.json";

const SummonerSpellsDisplay = ({ playerData }: { playerData: ParticipantDto }) => {
  // Find image links for summoner spells
  const summoner1 = summonerSpells.find((spell) => spell.id === playerData.summoner1Id);
  const summoner2 = summonerSpells.find((spell) => spell.id === playerData.summoner2Id);
  const correctedSummoner1 = summoner1?.iconPath.replace(" ", "_").toLowerCase();
  const correctedSummoner2 = summoner2?.iconPath.replace(" ", "_").toLowerCase();
  const summoner1Link = `https://raw.communitydragon.org${correctedSummoner1}`;
  const summoner2Link = `https://raw.communitydragon.org${correctedSummoner2}`;
  return (
    <div className="summonerSpells flex flex-col items-center gap-2">
      <img src={summoner1Link} className="w-6 h-6"></img>
      <img src={summoner2Link} className="w-6 h-6"></img>
    </div>
  );
};

export default SummonerSpellsDisplay;
