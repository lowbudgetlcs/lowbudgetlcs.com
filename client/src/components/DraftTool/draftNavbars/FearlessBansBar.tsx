import { useCallback, useEffect, useRef, useState } from "react";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessBansBar = () => {
  const { fearlessState } = useFearlessContext();
  const [barIsOpen, setBarIsOpen] = useState<boolean>(false);
  const FearlessBarRef = useRef<any>(null)
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (FearlessBarRef.current && !FearlessBarRef.current.contains(e.target)) {
      setBarIsOpen(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  },[handleClickOutside])
  
  if (!fearlessState) {
    return null;
  }
  return (
    <>
      <div ref={FearlessBarRef} className="fearlessBans group relative flex flex-col items-center justify-center">
        <div
          onClick={() => setBarIsOpen(!barIsOpen)}
          className="champContainerPullup absolute -top-6 w-12 h-6 bg-black border-white/80 border-x-2 border-t-2 flex items-center rounded-t-md hover:cursor-pointer"
        >
          <div
            className={`line w-8 h-2 bg-white rounded translate-x-1 transition duration-300 ${
              barIsOpen ? "rotate-[30deg]" : "rotate-[-30deg]"
            } `}
          ></div>
          <div
            className={`line w-8 h-2 bg-white rounded -translate-x-1 transition duration-300 ${
              barIsOpen ? "rotate-[-30deg]" : "rotate-[30deg]"
            }  `}
          ></div>
        </div>
        <div
          className={`absolute hidden group-hover:animate-fadeIn-300ms group-hover:flex -top-14 w-28 text-center items-center justify-center rounded-md border-2 border-gray font-bold h-6 bg-light-gray`}
        >
          <p className="text-sm">Previous Picks</p>
        </div>
        {barIsOpen && (
          <div className="absolute bottom-8 min-w-[64vw] lg:min-w-[50vw] xl:min-w-64 min-h-24 pb-4 pt-2 px-2 z-20
          bg-black border-2 border-gray rounded-md shadow-2xl flex flex-col gap-2 items-center justify-center animate-fadeIn-300ms">
            <p className="font-bold text-lg">Previous Picks</p>
            <div className="bansBox grid grid-cols-10 gap-2">
              {fearlessState.allPicks.map((ban, index) => {
                const fixedName =
                  ban.toLowerCase() === "wukong" ? "monkeyKing" : ban;
                const imageURL = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/splashTile`;
                return (
                  <div
                    className={`banBox ${ban} w-12 h-12 border-2 border-gray rounded-md`}
                    key={index}
                  >
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
          </div>
        )}
      </div>
    </>
  );
};

export default FearlessBansBar;
