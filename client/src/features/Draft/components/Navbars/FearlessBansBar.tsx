import { useRef } from "react";
import { useFearlessContext } from "../../providers/FearlessProvider";
import lblcsIcon from "../../../../assets/icons/lblcsIcon.svg";
interface FearlessBansBarProps {
  barIsOpen: boolean;
  setBarIsOpen: (isOpen: boolean) => void;
}

const FearlessBansBar = ({ barIsOpen, setBarIsOpen }: FearlessBansBarProps) => {
  const { fearlessState } = useFearlessContext();

  const FearlessBarRef = useRef<any>(null);
  // const handleClickOutside = useCallback((e: MouseEvent) => {
  //   if (FearlessBarRef.current && !FearlessBarRef.current.contains(e.target)) {
  //     setBarIsOpen(false);
  //   }
  // }, []);
  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside, true);
  //   return () => document.removeEventListener("mousedown", handleClickOutside, true);
  // }, [handleClickOutside]);

  if (!fearlessState) {
    return null;
  }

  const loopThroughCompletedDrafts = () => {
    const picksByGame: Array<Array<string>> = [];
    for (let i = 1; i <= fearlessState.completedDrafts; i++) {
      const picksToGet = i * 5;
      const team1Picks = fearlessState.team1Picks.slice(picksToGet - 5, picksToGet);
      const team2Picks = fearlessState.team2Picks.slice(picksToGet - 5, picksToGet);
      if (team1Picks.every((pick) => pick === "nothing") && team2Picks.every((pick) => pick === "nothing")) {
        continue;
      }
      picksByGame.push([...team1Picks, ...team2Picks]);
    }
    return picksByGame;
  };
  return (
    <>
      <div
        ref={FearlessBarRef}
        onClick={() => setBarIsOpen(!barIsOpen)}
        className={`previousFearlessPicks select-none w-full flex flex-col justify-center-center cursor-pointer ${barIsOpen ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-light"} transition-all duration-150`}>
        <p className={`text-xl select-none font-bold pl-2`}>Previous Fearless Picks</p>
        <div
          className={`w-full ${barIsOpen ? "h-full py-4" : "h-0"} z-20 rounded-md shadow-2xl flex flex-col gap-6 items-center justify-center transition-height duration-300`}>
          {loopThroughCompletedDrafts().map((gamePicks, index) => {
            return (
              <div key={`Game` + index} className={`${!barIsOpen ? "hidden" : ""} flex gap-4 items-center justify-center w-full text-text-primary`}>
                <div className="blueSide flex gap-2">
                  {gamePicks.slice(0, 5).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img key={pick + index} src={lblcsIcon} alt={`${pick}`} className="w-12 h-12 border border-border grayscale opacity-50" />
                    ) : (
                      <div key={pick + index} className="w-12 h-12 relative border border-border group">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                          alt={`${pick}`}
                        />
                        <div className="absolute hidden group-hover:block left-1/2 transform -translate-x-1/2">
                          <p className="text-sm text-text-primary px-2 bg-bg-light border border-border rounded-md">{pick}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-lg text-text-secondary font-bold">Game {index + 1}</p>
                <div className="redSide flex gap-2">
                  {gamePicks.slice(5, 10).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img key={pick + index} src={lblcsIcon} alt={`${pick}`} className="w-12 h-12 border border-border grayscale opacity-50" />
                    ) : (
                      <div key={pick + index} className="w-12 h-12 relative border border-border group">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                          alt={`${pick}`}
                        />
                        <div className="absolute hidden group-hover:block left-1/2 transform -translate-x-1/2">
                          <p className="text-sm text-text-primary px-2 bg-bg-light border border-border rounded-md">{pick}</p>
                        </div>
                      </div>
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
