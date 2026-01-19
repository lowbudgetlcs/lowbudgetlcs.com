import DisplayBans from "../../components/draftViews/DisplayBans";
import { Champion } from "../../interfaces/draftInterfaces";
import { useEffect, useState } from "react";
import StreamPicks from "../../components/StreamView/StreamPicks";
import PickBox from "../../components/StreamView/PickBox";
import BanBox from "../../components/StreamView/BanBox";
import { useDraftContext } from "../../providers/DraftProvider";
import { useSettingsContext } from "../../providers/SettingsProvider";
import LogoBox from "../../components/StreamView/LogoBox";
import { useLocation } from "react-router-dom";
import FearlessNav from "../../components/Navbars/FearlessNav";

function StreamDisplay({ championRoles }: { championRoles: Champion[] }) {
  const { draftState } = useDraftContext();
  const { teamNameVisible } = useSettingsContext();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    Math.max(draftState.timer - 4, 0) || 30
  );
  const location = useLocation();
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

  return (
    <div className="draftContainer relative text-white h-screen max-h-screen bg-black flex flex-col">
      {isFearless && (
        <div className="relative z-10">
          <FearlessNav />
        </div>
      )}
      {/* Logo Boxes */}
      <div className="absolute top-52 left-48 flex justify-between">
        <LogoBox />
      </div>
      <div className="absolute top-52 right-48 flex justify-between">
        <LogoBox />
      </div>
      <div className="absolute w-full bottom-0 text-text-primary flex flex-col">
          <div className="teamNames flex justify-between items-center z-10">
            <div
              className={`blueName relative w-full max-w-[39%] truncate py-2 px-4 ${
                draftState.displayTurn === "blue" ? "animate-pulse" : ""
              }`}>
              <h2
                className={`text-left flex gap-2 font-bold text-2xl w-full ${
                  teamNameVisible ? "" : "text-transparent"
                }`}>
                <span className="truncate">{draftState.blueDisplayName}</span>
              </h2>
              <div
                className={`timerLine h-1 rounded-xl bg-blue transition-width ${draftState.displayTurn === "blue" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
                style={{
                  width: `${draftState.displayTurn === "blue" ? timerWidth : draftState.blueReady ? 100 : 20}%`,
                }}></div>
            </div>
            <div
              className={`redName relative flex flex-col items-end w-full max-w-[39%] truncate py-2 px-4 ${
                draftState.displayTurn === "red" ? "animate-pulse" : ""
              }`}>
              <h2
                className={`text-right flex gap-2 font-bold text-2xl w-full justify-end ${
                  teamNameVisible ? "" : "text-transparent"
                }`}>
                <span className="truncate">{draftState.redDisplayName}</span>
              </h2>
              <div
                className={`timerLine h-1 rounded-xl bg-red transition-width ${draftState.displayTurn === "red" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
                style={{
                  width: `${draftState.displayTurn === "red" ? timerWidth : draftState.redReady ? 100 : 20}%`,
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
            draftState.displayTurn === "blue"
              ? "bg-blue"
              : draftState.displayTurn === "red"
              ? "bg-red"
              : ""
          } origin-center transition-all duration-200`}
          style={{
            width: "100%",
            transform: `scaleX(${timerWidth / 113.333})`,
            transformOrigin: "center",
          }}
        ></div>
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
