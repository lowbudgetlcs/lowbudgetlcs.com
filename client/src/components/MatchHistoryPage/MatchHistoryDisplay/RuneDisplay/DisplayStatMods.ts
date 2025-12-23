import { ParticipantDto } from "../../../../types/MatchV5";
import runes from "../../../json/perks.json";
const DisplayStatMod = (playerData: ParticipantDto, statType: string) => {
  const defense = playerData.perks.statPerks.defense;
  const flex = playerData.perks.statPerks.flex;
  const offense = playerData.perks.statPerks.offense;

  const rawStat = runes.find(
    (rune) => rune.id === (statType === "defense" ? defense : statType === "flex" ? flex : offense)
  );
  const correctedStat = rawStat?.iconPath.replace(" ", "_").toLowerCase();
  const statLink = `https://raw.communitydragon.org${correctedStat}`;

  return statLink;
};

const DisplayAllStatMods = (playerData: ParticipantDto) => {
  const links: string[] = [];
  const statTypes = ["offense", "flex", "defense"];

  for (let i = 0; i < 3; i++) {
    const runeToPush = DisplayStatMod(playerData, statTypes[i]);
    if (runeToPush) {
      links.push(runeToPush);
    }
  }
  return links;
};

export default DisplayAllStatMods;
