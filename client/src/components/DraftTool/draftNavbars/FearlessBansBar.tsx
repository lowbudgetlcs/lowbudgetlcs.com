import { useState } from "react";
import { useFearlessContext } from "../providers/FearlessProvider";
import DisplayBanImage from "../draftViews/DisplayBanImage";

const FearlessBansBar = () => {
  const { fearlessState } = useFearlessContext();
  if (!fearlessState) {
    return null;
  }
  const [barIsOpen, setBarIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="fearlessBans group relative flex flex-col items-center justify-center">
        <div
          onClick={() => setBarIsOpen(!barIsOpen)}
          className="champContainerPullup absolute -top-6 w-12 h-6 bg-black border-white/80 border-x-2 border-t-2 flex items-center rounded-t-md hover:cursor-pointer">
          <div
            className={`line w-8 h-2 bg-white rounded translate-x-1 transition duration-300 ${
              barIsOpen ? "rotate-[30deg]" : "rotate-[-30deg]"
            } `}></div>
          <div
            className={`line w-8 h-2 bg-white rounded -translate-x-1 transition duration-300 ${
              barIsOpen ? "rotate-[-30deg]" : "rotate-[30deg]"
            }  `}></div>
        </div>
        <div
          className={`absolute hidden group-hover:animate-fadeIn group-hover:flex -top-14 w-28 text-center items-center justify-center rounded-md border-2 border-gray font-bold h-6 bg-light-gray`}>
          <p className="text-sm">Fearless Bans</p>
        </div>
        {barIsOpen && (
          <div className="bansBox absolute bottom-8 grid grid-cols-10 gap-2 justify-center items-center min-w-48 min-h-24 p-4 z-10 bg-light-gray rounded-md border-2 border-gray shadow-2xl">
            {fearlessState.allBans.map((ban, index) => {
              const fixedName = ban.toLowerCase() === "wukong" ? "monkeyKing" : ban;
              const imageURL = `https://cdn.communitydragon.org/latest/champion/${fixedName}/square`;
              return (
                <div
                  className={`banBox ${ban} w-12 h-12 border-2 border-gray rounded-md`}
                  key={index}>
                  {ban !== "nothing" && (
                    <img
                      src={imageURL}
                      alt={ban !== "nothing" ? ban : "Nothing"}
                      className={`w-full h-full object-cover grayscale-[40%]`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default FearlessBansBar;
