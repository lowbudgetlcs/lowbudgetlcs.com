import DisplayBans from "../DisplayBans";
import { DraftDisplayProps, DraftProps } from "../draftInterfaces";
import { useEffect, useState } from "react";
import Timer from "../Timer";
import { useSocketContext } from "../DraftPage";
import StreamPicks from "./StreamPicks";
import PickBox from "./PickBox";

function StreamDisplay({
  draftState,
  lobbyCode,
  sideCode,
  championRoles,
  playerSide,
}: DraftDisplayProps) {
  const { socket } = useSocketContext();
  const [chosenChamp, setChosenChamp] = useState<string>();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentHover, setCurrentHover] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(draftState.timer || 30);

  const timerWidth = (timeLeft / 30) * 100;
  // Clear the hover state when the phase changes
  useEffect(() => {
    setCurrentHover(null);
  }, [draftState.activePhase, draftState.displayTurn]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleHover = (state: DraftProps) => {
      if (state.currentHover) {
        setChosenChamp(state.currentHover);
      }
      setCurrentHover(state.currentHover);
    };

    socket.on("banHover", handleHover);
    socket.on("pickHover", handleHover);
    return () => {
      socket.off("banHover", handleHover);
      socket.off("pickHover", handleHover);
    };
  }, []);

  useEffect(() => {
    if (!draftState.bluePick && chosenChamp) {
      setChosenChamp(undefined);
    }
    if (!draftState.redPick && chosenChamp) {
      setChosenChamp(undefined);
    }
  }, [draftState.bluePick, draftState.redPick]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (draftState.displayTurn !== playerSide) {
      setChosenChamp("");
    } else {
      socket.emit("clientHover", { chosenChamp, lobbyCode, sideCode });
    }
  }, [chosenChamp]);

  useEffect(() => {
    if (draftState.displayTurn || draftState.phaseType) {
      setTimeLeft(draftState.timer || 34);
      setIsTimerRunning(true);
    }
  }, [draftState.displayTurn, draftState.phaseType, draftState.timer]);

  useEffect(() => {
    setTimeLeft(draftState.timer || 30);
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
    <div className="h-screen relative">
      <div className="absolute w-full bottom-0 text-white flex flex-col">
        <div className="teamTitles relative flex justify-between px-4">
          <div
            className={`blueTitle py-2 px-4 ${
              draftState.blueReady || draftState.displayTurn === "blue"
                ? "w-96"
                : "w-52"
            } bg-blue/60 ${
              draftState.displayTurn === "blue" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2 className="text-right font-bold text-xl">
              {draftState.blueDisplayName}
            </h2>
          </div>
          <div className="timer absolute left-0 right-0 top-1 bottom-0 text-center text-2xl font-bold">
            <Timer
              timer={draftState.timer}
              displayTurn={draftState.displayTurn}
            />
          </div>
          <div
            className={`redTitle py-2 px-4 ${
              draftState.redReady || draftState.displayTurn === "red"
                ? "w-96"
                : "w-52"
            } bg-red/60 ${
              draftState.displayTurn === "red" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2 className="font-bold text-xl">{draftState.redDisplayName}</h2>
          </div>
        </div>
        {/* Champion Bans*/}
        <div className="champBans flex w-full justify-between gap-8 items-center pt-4 px-4">
          {/* Blue Side Bans */}
          <div className="blueSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col max-[1275px]:items-start">
            <DisplayBans
              draftState={draftState}
              bans={draftState.blueBans}
              enemyBans={draftState.redBans}
              playerSide={"blue"}
              playerTurn={draftState.displayTurn}
              currentPhase={draftState.activePhase}
              currentHover={currentHover}
            />
          </div>

          {/* Red Side Bans */}
          <div className="redSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col-reverse max-[1275px]:items-end">
            <DisplayBans
              draftState={draftState}
              bans={draftState.redBans}
              enemyBans={draftState.blueBans}
              playerSide={"red"}
              playerTurn={draftState.displayTurn}
              currentPhase={draftState.activePhase}
              currentHover={currentHover}
            />
          </div>
        </div>
        <div
          className={`timerLine w-full h-2 ${
            draftState.displayTurn === "blue"
              ? "bg-blue"
              : draftState.displayTurn === "red"
              ? "bg-red"
              : "bg-gray"
          } origin-center `}
          style={{
            width: "100%",
            transform: `scaleX(${timerWidth / 100})`,
            transformOrigin: "center",
          }}
        ></div>
        {/* Picks Container */}
        <div className="relative champPicks flex justify-between flex-1">
          {/* Blue Side Picks */}
          <div className="blueSidePicks flex gap-4 draftMd:p-4 p-0 px-2 py-4">
            <StreamPicks
              draftState={draftState}
              picks={draftState.bluePicks}
              enemyPicks={draftState.redPicks}
              championRoles={championRoles}
              playerTurn={draftState.displayTurn}
              playerSide={"blue"}
              currentPhase={draftState.activePhase}
              currentHover={currentHover}
            />
          </div>
          <PickBox draftState={draftState} championRoles={championRoles} />
          {/* Red Side Picks */}
          <div className="redSidePicks flex flex-row-reverse gap-4 draftMd:p-4 p-0 px-2 py-4">
            <StreamPicks
              draftState={draftState}
              picks={draftState.redPicks}
              enemyPicks={draftState.bluePicks}
              championRoles={championRoles}
              playerTurn={draftState.displayTurn}
              playerSide={"red"}
              currentPhase={draftState.activePhase}
              currentHover={currentHover}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamDisplay;
