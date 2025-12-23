import { ParticipantDto } from "../../../../types/MatchV5";
import DisplayRuneImage from "./DisplayRuneImage";

const ShowAllRuneImages = (playerData: ParticipantDto, styleType: string, initialInt: number) => {
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
      const runeToPush = DisplayRuneImage(playerData, i, styleType);
      if (runeToPush) {
        links.push(runeToPush);
      }
    }
  }
  return links;
};

export default ShowAllRuneImages;
