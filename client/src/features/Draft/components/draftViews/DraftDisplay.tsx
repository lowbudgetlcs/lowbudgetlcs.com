import { IoSearch } from "react-icons/io5";
import DisplayBans from "./DisplayBans";
import RoleSelect from "./RoleSelect";
import LoadChampIcons from "./LoadChampIcons";
import { Champion } from "../../interfaces/draftInterfaces";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import DraftButton from "./DraftButton";
import Button from "../../../../components/Button";
import Timer from "./Timer";
import DisplayPicks from "./DisplayPicks";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import downloadFile from "../../../../utils/downloadFile";
import { useDraftContext } from "../../providers/DraftProvider";
import { useLocation } from "react-router-dom";
import FearlessNav from "../Navbars/FearlessNav";
import { useSettingsContext } from "../../providers/SettingsProvider";
import DraftTurnAudio from "../DraftAudio";
import FearlessBansBar from "../Navbars/FearlessBansBar";
import { IoMdRefresh } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";

function DraftDisplay({ championRoles }: { championRoles: Champion[] }) {
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [timerWidth, setTimerWidth] = useState<number>(100);
  const { draftState, playerSide } = useDraftContext();
  const { teamNameVisible, champIconsVisible, iconSize, setIconSize, barIsOpen, setBarIsOpen } = useSettingsContext();

  const location = useLocation();
  const isFearless = location.pathname.includes("/fearless");
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      setSelectedRole("All");
    }
  }, [searchValue]);
  const downloadDraftData = useCallback(() => {
    if (!draftState.draftComplete) return;

    const draftObject = {
      blueName: draftState.blueDisplayName,
      bluePicks: draftState.bluePicks,
      blueBans: draftState.blueBans,
      redName: draftState.redDisplayName,
      redPicks: draftState.redPicks,
      redBans: draftState.redBans,
    };

    const lobbyCode = sessionStorage.getItem("activeLobbyCode");
    downloadFile(JSON.stringify(draftObject), `Draft-${lobbyCode}.json`, "application/json");
  }, [
    draftState.draftComplete,
    draftState.blueDisplayName,
    draftState.bluePicks,
    draftState.blueBans,
    draftState.redDisplayName,
    draftState.redPicks,
    draftState.redBans,
  ]);

  useEffect(() => {
    setTimerWidth((draftState.timer / 30) * 100);
  }, [draftState.timer]);

  return (
    <div className="draftContainer relative text-text-primary h-screen max-h-screen flex flex-col">
      <div className="timer flex w-full justify-center items-center text-2xl font-bold mt-2">
        <Timer timer={draftState.timer} displayTurn={draftState.displayTurn} />
      </div>
      {/* Main Container */}
      <div className="mainDraftContainer relative flex flex-1 gap-4 h-[70vh]">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-2 px-4 pt-4 flex-1 items-stretch">
          <DisplayPicks championRoles={championRoles} playerSide={"blue"} />
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer relative w-full min-[1922px]:max-w-360 flex flex-col">
          <div
            className={`absolute top-2 left-0 right-0 bottom-0 w-full h-full rounded-3xl animate-pulse ${
              playerSide === draftState.displayTurn
                ? draftState.phaseType === "ban"
                  ? "bg-red/25"
                  : draftState.phaseType === "pick"
                    ? "bg-blue/25"
                    : "hidden"
                : "hidden"
            } z-0 filter blur-lg`}></div>
          <div className="teamNames flex justify-between items-center z-10">
            <div className={`blueName relative w-full max-w-[50%] truncate py-2 px-4 ${draftState.displayTurn === "blue" ? "animate-pulse" : ""}`}>
              <h2 className={`text-left flex gap-2 font-bold text-2xl w-full ${teamNameVisible ? "" : "text-transparent"}`}>
                <span className="truncate">{draftState.blueDisplayName}</span>
                <span className={`shrink-0 flex items-center font-normal text-text-secondary gap-2 ${playerSide !== "blue" && "hidden"}`}>
                  <FaArrowLeft /> You
                </span>
              </h2>
              <div
                className={`timerLine h-1 rounded-xl bg-blue transition-width ${draftState.displayTurn === "blue" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
                style={{
                  width: `${draftState.displayTurn === "blue" ? timerWidth : draftState.blueReady ? 100 : 20}%`,
                }}></div>
            </div>
            <div
              className={`redName relative flex flex-col items-end w-full max-w-[50%] truncate py-2 px-4 ${
                draftState.displayTurn === "red" ? "animate-pulse" : ""
              }`}>
              <h2 className={`text-right flex gap-2 font-bold text-2xl w-full justify-end ${teamNameVisible ? "" : "text-transparent"}`}>
                <span className={`shrink-0 flex items-center font-normal text-text-secondary gap-2 ${playerSide !== "red" && "hidden"}`}>
                  You <FaArrowRight />
                </span>
                <span className="truncate">{draftState.redDisplayName}</span>
              </h2>
              <div
                className={`timerLine h-1 rounded-xl bg-red transition-width ${draftState.displayTurn === "red" ? "duration-1000 ease-linear" : "duration-500 ease-out"}`}
                style={{
                  width: `${draftState.displayTurn === "red" ? timerWidth : draftState.redReady ? 100 : 20}%`,
                }}></div>
            </div>
          </div>
          {isFearless && (
            <div className="relative z-10">
              <FearlessNav />
            </div>
          )}
          {/* Search and Role Filter */}
          <div
            className={`relative searchFilter flex justify-between items-center px-6 py-4 flex-col-reverse xl:flex-row gap-4 ${
              champIconsVisible ? "" : "hidden"
            }`}>
            <div className="relative champFilter flex gap-4">
              <RoleSelect selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
            </div>
            <div className="flex gap-2">
              <form className="relative bg-gray flex items-center rounded-md">
                <label htmlFor="championSearch" className="px-2">
                  <IoSearch className="text-3xl" />
                </label>
                <input
                  type="text"
                  id="championSearch"
                  className="champSearch p-2 bg-gray focus:border-none rounded-md focus:outline-0"
                  placeholder="Search Champion"
                  value={searchValue}
                  onChange={handleSearchChange}></input>
              </form>
              <div className={`iconSizeButtons flex gap-2 ${champIconsVisible ? "" : "hidden"}`}>
                <Button className={`addButton text-xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(iconSize + 10)}>
                  <FaPlus />
                </Button>
                <Button className={`subtractButton text-xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(iconSize - 10)}>
                  <FaMinus />
                </Button>
                <Button className={`resetButton text-2xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(60)}>
                  <IoMdRefresh />
                </Button>
              </div>
            </div>
          </div>
          {/* List of Champion Images */}
          <div className={`relative overflow-y-scroll h-full bg-transparent ${champIconsVisible ? "" : "hidden"}`}>
            <div className="relative">
              <ul className="relative champions flex flex-wrap gap-2 justify-center z-10 py-2 transition-height duration-300">
                <LoadChampIcons searchValue={searchValue} selectedRole={selectedRole} />
              </ul>
            </div>
          </div>
          {isFearless && (
            <div className="sticky bottom-0 left-0 right-0 border border-border rounded-md">
              <FearlessBansBar barIsOpen={barIsOpen} setBarIsOpen={setBarIsOpen} />
            </div>
          )}
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col flex-1 gap-2 px-4 pt-4 items-stretch">
          <DisplayPicks championRoles={championRoles} playerSide={"red"} />
        </div>
      </div>

      {/* Champion Bans*/}
      <div className="champBans flex w-full justify-between gap-8 items-center pt-4 pb-2 px-4 mt-auto">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col max-[1275px]:items-start">
          <DisplayBans playerSide={"blue"} />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <DraftButton />

          {draftState.draftComplete && (
            <button
              className={`downloadBtn p-2 bg-green/60 hover:bg-green hover:cursor-pointer font-bold max-h-16 flex items-center justify-center rounded-md transition duration-300`}
              onClick={downloadDraftData}>
              Download Draft JSON
            </button>
          )}
        </div>

        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-4 max-[1275px]:flex-col-reverse max-[1275px]:items-end">
          <DisplayBans playerSide={"red"} />
        </div>
      </div>
      <DraftTurnAudio />
    </div>
  );
}

export default DraftDisplay;
