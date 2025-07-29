import { ParticipantDto } from "../interfaces/MatchV5";
import runeSets from "../json/perkstyles.json";

const DisplayRuneSetImage = (playerData: ParticipantDto) => {
  const rawRuneSet = playerData.perks.styles.find((style) => style.description === "subStyle");
  const foundRuneSet = runeSets.styles.find((rune) => rune.id === rawRuneSet?.style);
  const correctedSecondaryRuneSet = foundRuneSet?.iconPath.replace(" ", "_").toLowerCase();
  const runeSetLink = `https://raw.communitydragon.org${correctedSecondaryRuneSet}`;
  return runeSetLink;
};

export default DisplayRuneSetImage