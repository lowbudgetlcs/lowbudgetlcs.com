import { ParticipantDto } from "../../types/MatchV5";
import runes from "../json/perks.json";
const DisplayRuneImage = (playerData: ParticipantDto, runeNumber: number, styleType: string) => {
  const rawPrimaryRune = playerData.perks.styles.find((style) => style.description === styleType);
  if (!rawPrimaryRune) return;
  const rawRune = runes.find((rune) => rune.id === rawPrimaryRune.selections[runeNumber].perk);
  const correctedRune = rawRune?.iconPath.replace(" ", "_").toLowerCase();
  const runeLink = `https://raw.communitydragon.org${correctedRune}`;

  return runeLink;
};

export default DisplayRuneImage;
