import { IoSearch } from "react-icons/io5";
import DisplayBans from "./DisplayBans";
import RoleSelect from "./RoleSelect";
import LoadChampIcons from "./LoadChampIcons";
import { Champion } from "../interfaces/draftInterfaces";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import DraftButton from "./DraftButton";
import Timer from "./Timer";
import DisplayPicks from "./DisplayPicks";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import downloadFile from "../../../utils/downloadFile";
import { useDraftContext } from "../providers/DraftProvider";
import { useLocation } from "react-router-dom";
import FearlessNav from "../draftNavbars/FearlessNav";
import { useSettingsContext } from "../providers/SettingsProvider";
import DraftTurnAudio from "../DraftAudio";

function DraftDisplay({ championRoles }: { championRoles: Champion[] }) {
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const { draftState, playerSide } = useDraftContext();
  const { teamNameVisible, champIconsVisible } = useSettingsContext();

  const location = useLocation();
  const isFearless = location.pathname.includes("/fearless");
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue.length > 0) {
      setSelectedRole("All")
    }
  },[searchValue])
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
    downloadFile(
      JSON.stringify(draftObject),
      `Draft-${lobbyCode}.json`,
      "application/json"
    );
  }, [
    draftState.draftComplete,
    draftState.blueDisplayName,
    draftState.bluePicks,
    draftState.blueBans,
    draftState.redDisplayName,
    draftState.redPicks,
    draftState.redBans,
  ]);

  return (
    <div className="draftContainer relative text-white h-screen max-h-screen flex flex-col">
      <div className="teamTitles relative flex justify-between px-4 py-2">
        <div className={`blueTitle flex items-center gap-4`}>
          <div
            className={`py-2 px-4 ${
              draftState.blueReady || draftState.displayTurn === "blue"
                ? "w-96"
                : "w-52"
            } bg-blue/60 ${
              draftState.displayTurn === "blue" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2
              className={`text-right font-bold text-xl ${
                teamNameVisible ? "" : "text-transparent"
              }`}
            >
              {draftState.blueDisplayName}
            </h2>
          </div>
          <div
            className={`sideIndicator flex gap-1 text-2xl items-center ${
              playerSide !== "blue" && "hidden"
            }`}
          >
            <FaArrowLeft />
            <p className="opacity-80">You</p>
          </div>
        </div>
        <div className="timer absolute left-0 right-0 top-2 bottom-0 text-center text-2xl font-bold">
          <Timer
            timer={draftState.timer}
            displayTurn={draftState.displayTurn}
          />
        </div>
        <div className={`redTitle flex items-center gap-4`}>
          <div
            className={`sideIndicator flex gap-1 text-2xl items-center ${
              playerSide !== "red" && "hidden"
            }`}
          >
            <p className="opacity-80">You</p>
            <FaArrowRight />
          </div>
          <div
            className={`py-2 px-4 ${
              draftState.redReady || draftState.displayTurn === "red"
                ? "w-96"
                : "w-52"
            } bg-red/60 ${
              draftState.displayTurn === "red" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2
              className={`font-bold text-xl ${
                teamNameVisible ? "" : "text-transparent"
              }`}
            >
              {draftState.redDisplayName}
            </h2>
          </div>
        </div>
      </div>
      {/* Main Container */}
      <div className="relative mainDraftContainer flex flex-1 h-[70vh]">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-2 px-4 pt-4 flex-1 items-stretch">
          <DisplayPicks championRoles={championRoles} playerSide={"blue"} />
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer relative w-full min-[1922px]:w-[90rem] flex flex-col">
          <div
            className={`absolute top-2 left-0 right-0 bottom-0 w-full h-full rounded-3xl animate-pulse ${
              playerSide === draftState.displayTurn
                ? draftState.phaseType === "ban"
                  ? "bg-red/25"
                  : draftState.phaseType === "pick"
                  ? "bg-blue/25"
                  : "hidden"
                : "hidden"
            } z-0 filter blur-lg`}
          ></div>
          {isFearless && (
            <div className="relative z-10">
              <FearlessNav />
            </div>
          )}
          <div className={`relative searchFilter flex justify-between items-center px-6 py-4 max-[1100px]:flex-col-reverse max-[1100px]:gap-4 ${champIconsVisible ? '' : 'hidden'}`}>
            <div className="relative champFilter flex gap-4">
              <RoleSelect
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </div>
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
                onChange={handleSearchChange}
              ></input>
            </form>
          </div>
          {/* List of Champion Images */}
          <div className={`relative overflow-y-scroll bg-transparent ${champIconsVisible ? '' : 'hidden'}`}>
            <div className="relative">
              <ul className="relative champions flex flex-wrap gap-2 justify-center z-10 py-2">
                <LoadChampIcons
                  championRoles={championRoles}
                  searchValue={searchValue}
                  selectedRole={selectedRole}
                />
              </ul>
            </div>
          </div>
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
              onClick={downloadDraftData}
            >
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
