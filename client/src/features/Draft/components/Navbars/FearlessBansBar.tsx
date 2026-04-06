import { useCallback, useEffect, useRef, useState } from "react";
import { useFearlessContext } from "../../providers/FearlessProvider";
import lblcsIcon from "../../../../assets/icons/lblcsIcon.svg";

const FearlessBansBar = () => {
  const { fearlessState } = useFearlessContext();
  const [barIsOpen, setBarIsOpen] = useState<boolean>(false);
  const FearlessBarRef = useRef<any>(null);
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (FearlessBarRef.current && !FearlessBarRef.current.contains(e.target)) {
      setBarIsOpen(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [handleClickOutside]);

  if (!fearlessState) {
    return null;
  }

  const loopThroughCompletedDrafts = () => {
    const picksByGame: Array<Array<string>> = [];
    for (let i = 1; i <= fearlessState.completedDrafts; i++) {
      const picksToGet = i * 5;
      const team1Picks = fearlessState.team1Picks.slice(picksToGet - 5, picksToGet);
      const team2Picks = fearlessState.team2Picks.slice(picksToGet - 5, picksToGet);
      picksByGame.push([...team1Picks, ...team2Picks]);
    }
    return picksByGame;
  };
  return (
    <>
      <div
        ref={FearlessBarRef}
        onClick={() => setBarIsOpen(!barIsOpen)}
        className="previousFearlessPicks absolute bottom-0 w-full bg-bg border border-border flex flex-col justify-center-center hover:cursor-pointer hover:bg-bg-light transition duration-150 group">
        <p className="text-xl text-text-secondary font-bold pl-2 group-hover:text-text-primary">Previous Fearless Picks</p>
        <div
          className={`w-full ${barIsOpen ? "" : "h-0"} z-20 border-x border-b border-border bg-bg rounded-md shadow-2xl flex flex-col gap-2 items-center justify-center`}>
          {loopThroughCompletedDrafts().map((gamePicks, index) => {
            return (
              <div key={`Game` + index} className="flex gap-1 items-center justify-center w-full text-text-primary">
                <div className="blueSide flex gap-2">
                  {gamePicks.slice(0, 5).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img key={pick + index} src={lblcsIcon} alt={`${pick}`} className="w-12 h-12 border border-border grayscale opacity-50" />
                    ) : (
                      <img
                        key={pick + index}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                        alt={`${pick}`}
                        className="w-12 h-12"
                      />
                    );
                  })}
                </div>
                <p>Game {index + 1}</p>
                <div className="redSide flex gap-2">
                  {gamePicks.slice(5, 10).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img key={pick + index} src={lblcsIcon} alt={`${pick}`} className="w-12 h-12 border border-border grayscale opacity-50" />
                    ) : (
                      <img
                        key={pick + index}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                        alt={`${pick}`}
                        className="w-12 h-12"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`absolute hidden group-hover:animate-fadeIn-300ms group-hover:flex -top-14 w-28 text-center items-center justify-center rounded-md border-2 border-gray font-bold h-6 bg-light-gray`}>
        <p className="text-sm">Previous Picks</p>
      </div>
    </>
  );
};

export default FearlessBansBar;
