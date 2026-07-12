import DisplayBans from "../../components/draftViews/DisplayBans";
import { Champion } from "../../interfaces/draftInterfaces";
import { useEffect, useState } from "react";
import StreamPicks from "../../components/StreamView/StreamPicks";
import PickBox from "../../components/StreamView/PickBox";
import BanBox from "../../components/StreamView/BanBox";
import { useDraftContext } from "../../providers/DraftProvider";
import { useSettingsContext } from "../../providers/SettingsProvider";
import { useLocation } from "react-router-dom";
import FearlessNav from "../../components/Navbars/FearlessNav";
import { useFearlessContext } from "../../providers/FearlessProvider";
import lblcsIcon from "../../../../assets/icons/lblcsIcon.svg";

function StreamDisplay({ championRoles }: { championRoles: Champion[] }) {
  const { draftState } = useDraftContext();
  const location = useLocation();
  const fearlessContext = location.pathname.includes("/fearless") ? useFearlessContext() : null;
  const fearlessState = fearlessContext?.fearlessState;
  const { teamNameVisible } = useSettingsContext();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.max(draftState.timer - 4, 0) || 30);

  const isFearless = location.pathname.includes("/fearless");

  // calculate width of timer bar
  const timerWidth = (timeLeft / 30) * 100;

  useEffect(() => {
    if (draftState.displayTurn || draftState.phaseType) {
      setTimeLeft(draftState.timer || 30);
      setIsTimerRunning(true);
    }
  }, [draftState.displayTurn, draftState.phaseType, draftState.timer]);

  useEffect(() => {
    setTimeLeft(draftState.timer);
  }, [draftState.timer]);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0.1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prevTime - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loopThroughCompletedDrafts = () => {
    if (!fearlessState || fearlessState.completedDrafts === 0) return [];
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
    <div className="draftContainer relative text-white h-screen max-h-screen bg-black flex flex-col">
      {isFearless && fearlessState && (
        <>
          <div className="relative z-10">
            <FearlessNav />
          </div>
          <div className="fearlessPicks flex justify-between">
            <div className={"blueSidePicks p-2 bg-bg border-border border rounded-xl shadow-md m-4"}>
              {fearlessState.team1Name === draftState.blueDisplayName ? (
                <>
                  <p className="text-xl font-bold truncate px-2">{fearlessState.team1Name}'s Picks</p>
                  <div className="flex flex-col gap-6 max-w-xl">
                    {loopThroughCompletedDrafts().map((gamePicks, index) => {
                      return (
                        <div key={`Game` + index} className={`flex gap-4 items-center w-full text-text-primary lg:px-4`}>
                          <p className="text-lg text-text-secondary font-bold text-nowrap">Game {index + 1}</p>
                          <div className="blueSide flex flex-wrap gap-2">
                            {gamePicks.slice(0, 5).map((pick, index) => {
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
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold truncate px-2">{fearlessState.team2Name}'s Picks</p>
                  <div className="flex flex-col gap-6 max-w-xl">
                    {loopThroughCompletedDrafts().map((gamePicks, index) => {
                      return (
                        <div key={`Game` + index} className={`flex gap-4 items-center w-full text-text-primary lg:px-4`}>
                          <p className="text-lg text-text-secondary font-bold text-nowrap">Game {index + 1}</p>
                          <div className="blueSide flex flex-wrap gap-2">
                            {gamePicks.slice(5, 10).map((pick, index) => {
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
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className={`redSidePicks p-2 bg-bg border-border border rounded-xl shadow-md m-4`}>
              {fearlessState.team2Name === draftState.redDisplayName ? (
                <>
                  <p className="text-xl font-bold truncate px-2 text-right">{fearlessState.team2Name}'s Picks</p>
                  <div className="flex flex-col gap-6 max-w-xl">
                    {loopThroughCompletedDrafts().map((gamePicks, index) => {
                      return (
                        <div key={`Game` + index} className={`flex gap-4 items-center w-full text-text-primary lg:px-4`}>
                          <div className="blueSide flex flex-wrap gap-2">
                            {gamePicks.slice(5, 10).map((pick, index) => {
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
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold truncate text-right px-2">{fearlessState.team1Name}'s Picks</p>
                  <div className="flex flex-col gap-6 max-w-xl">
                    {loopThroughCompletedDrafts().map((gamePicks, index) => {
                      return (
                        <div key={`Game` + index} className={`flex gap-4 items-center w-full text-text-primary lg:px-4`}>
                          <div className="blueSide flex flex-wrap gap-2">
                            {gamePicks.slice(0, 5).map((pick, index) => {
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
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <div className="absolute w-full bottom-0 text-text-primary flex flex-col">
        <div className="teamNames flex justify-between items-center z-10">
          <div className={`blueName relative w-full max-w-[39%] truncate py-2 px-4 ${draftState.displayTurn === "blue" ? "animate-pulse" : ""}`}>
            <h2 className={`text-left flex gap-2 font-bold text-2xl w-full ${teamNameVisible ? "" : "text-transparent"}`}>
              <span className="truncate">{draftState.blueDisplayName}</span>
            </h2>
            <div
              className={`timerLine h-1 rounded-xl bg-blue transition-width ${draftState.displayTurn === "blue" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
              style={{
                width: `${draftState.blueReady ? 100 : 20}%`,
              }}></div>
          </div>
          <div
            className={`redName relative flex flex-col items-end w-full max-w-[39%] truncate py-2 px-4 ${
              draftState.displayTurn === "red" ? "animate-pulse" : ""
            }`}>
            <h2 className={`text-right flex gap-2 font-bold text-2xl w-full justify-end ${teamNameVisible ? "" : "text-transparent"}`}>
              <span className="truncate">{draftState.redDisplayName}</span>
            </h2>
            <div
              className={`timerLine h-1 rounded-xl bg-red transition-width ${draftState.displayTurn === "red" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
              style={{
                width: `${draftState.redReady ? 100 : 20}%`,
              }}></div>
          </div>
        </div>
        {/* Champion Bans*/}
        <div className="champBans flex w-full justify-between gap-8 items-center pt-4 px-4">
          {/* Blue Side Bans */}
          <div className="blueSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col max-[1275px]:items-start">
            <DisplayBans playerSide={"blue"} />
          </div>

          {/* Red Side Bans */}
          <div className="redSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col-reverse max-[1275px]:items-end">
            <DisplayBans playerSide={"red"} />
          </div>
        </div>
        {/* Timer Line */}
        <div
          className={`timerLine w-full h-2 m-2 self-center ${
            draftState.displayTurn === "blue" ? "bg-blue" : draftState.displayTurn === "red" ? "bg-red" : ""
          } origin-center transition-all duration-200`}
          style={{
            width: "100%",
            transform: `scaleX(${timerWidth / 113.333})`,
            transformOrigin: "center",
          }}></div>
        {/* Picks Container */}
        <div className="relative champPicks flex justify-between flex-1">
          {/* Blue Side Picks */}
          <div className="blueSidePicks flex gap-4 px-2">
            <StreamPicks championRoles={championRoles} playerSide={"blue"} />
          </div>
          <PickBox draftState={draftState} championRoles={championRoles} />
          <BanBox draftState={draftState} championRoles={championRoles} />
          {/* Red Side Picks */}
          <div className="redSidePicks flex flex-row-reverse gap-4 px-2 pb-4">
            <StreamPicks championRoles={championRoles} playerSide={"red"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamDisplay;
