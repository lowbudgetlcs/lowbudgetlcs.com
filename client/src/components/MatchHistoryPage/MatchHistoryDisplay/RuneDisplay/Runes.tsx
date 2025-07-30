import { useState } from "react";
import { ParticipantDto } from "../../interfaces/MatchV5";
import DisplayRuneImage from "./DisplayRuneImage";
import DisplayRuneSetImage from "./DisplayRuneSetImage";
import ShowAllRuneImages from "./ShowAllRuneImages";
import DisplayAllStatMods from "./DisplayStatMods";

const Runes = ({ playerData }: { playerData: ParticipantDto }) => {
  const [runesShown, setRunesShown] = useState<boolean>(false);
  //   Find image links for runes
  const primaryRuneLink = DisplayRuneImage(playerData, 0, "primaryStyle");
  const secondaryRuneSetLink = DisplayRuneSetImage(playerData);
  return (
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
          <div className="flex gap-0.5">
            {ShowAllRuneImages(playerData, "primaryStyle", 1).map((link) => {
              return <img src={link} key={link} className="w-6 h-6"></img>;
            })}
          </div>
          <div className="flex gap-0.5">
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
  );
};

export default Runes;
