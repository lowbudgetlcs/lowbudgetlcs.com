import { useRef } from "react";
import { useDraftContext } from "../../providers/DraftProvider";
import { useFearlessContext } from "../../providers/FearlessProvider";
import lblcsIcon from "../../../../assets/icons/lblcsIcon.svg";
interface FearlessBansBarProps {
  barIsOpen: boolean;
  setBarIsOpen: (isOpen: boolean) => void;
}

const FearlessBansBar = ({ barIsOpen, setBarIsOpen }: FearlessBansBarProps) => {
  const { draftState } = useDraftContext();
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

  const team1IsBlueSide = fearlessState.team1Name === draftState.blueDisplayName;
  const leftTeamName = team1IsBlueSide ? fearlessState.team1Name : fearlessState.team2Name;
  const rightTeamName = team1IsBlueSide ? fearlessState.team2Name : fearlessState.team1Name;
  const getLeftSidePicks = (gamePicks: string[]) => (team1IsBlueSide ? gamePicks.slice(0, 5) : gamePicks.slice(5, 10));
  const getRightSidePicks = (gamePicks: string[]) => (team1IsBlueSide ? gamePicks.slice(5, 10) : gamePicks.slice(0, 5));
  return (
    <>
      <div
        ref={FearlessBarRef}
        onClick={() => setBarIsOpen(!barIsOpen)}
        className={`previousFearlessPicks select-none w-full h-full flex flex-col justify-center-center cursor-pointer ${barIsOpen ? "text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-light"} transition-all duration-150`}>
        <div className={`text-xl select-none font-bold w-full px-2 py-1`}>Champions Used<div className={`${barIsOpen ? "block" : "hidden"} w-full h-1 rounded-full bg-border`}></div></div>
        <div className={`${barIsOpen ? "" : "hidden"} flex justify-between w-full xl:px-4 pt-2`}>
          <div className="font-bold">
            {leftTeamName}
            <div className={`${barIsOpen ? "block" : "hidden"} w-16 h-1 rounded-full bg-orange`}></div>
          </div>

          <div className="font-bold relative">
            {rightTeamName}
            <div className={`${barIsOpen ? "block" : "hidden"} w-16 h-1 rounded-full bg-orange right-0 absolute`}></div>
          </div>
        </div>
        <div className={`w-full ${barIsOpen ? "h-full py-4" : "h-0"} z-20 rounded-md shadow-2xl flex flex-col gap-10 items-center justify-center`}>
          {loopThroughCompletedDrafts().map((gamePicks, index) => {
            return (
              <div
                key={`Game` + index}
                className={`${!barIsOpen ? "hidden" : ""} flex justify-between gap-4 items-center  w-full text-text-primary lg:px-4`}>
                <div className="blueSide flex flex-wrap gap-2 justify-center">
                  {getLeftSidePicks(gamePicks).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img
                        key={pick + index}
                        src={lblcsIcon}
                        alt={`${pick}`}
                        className={`w-8 h-8 xl:h-12 xl:w-12 border border-border grayscale opacity-50`}
                      />
                    ) : (
                      <div key={pick + index} className="w-8 h-8 xl:h-12 xl:w-12 relative border border-border group">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                          alt={`${pick}`}
                          className="grayscale-75"
                        />
                        <div className="absolute hidden group-hover:block left-1/2 transform -translate-x-1/2 top-full mt-1">
                          <p className="text-sm text-text-primary px-2 bg-bg-light border border-border rounded-md">{pick}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-lg text-text-secondary font-bold text-nowrap">Game {index + 1}</p>
                <div className="redSide flex flex-wrap gap-2 justify-center">
                  {getRightSidePicks(gamePicks).map((pick, index) => {
                    return pick === "nothing" ? (
                      <img
                        key={pick + index}
                        src={lblcsIcon}
                        alt={`${pick}`}
                        className="w-8 h-8 xl:h-12 xl:w-12 border border-border grayscale opacity-50"
                      />
                    ) : (
                      <div key={pick + index} className="w-8 h-8 xl:h-12 xl:w-12 relative border border-border group">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${pick === "Wukong" ? "MonkeyKing" : pick}/square`}
                          alt={`${pick}`}
                          className="grayscale-75"
                        />
                        <div className="absolute hidden group-hover:block left-1/2 transform -translate-x-1/2 top-full mt-1">
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
