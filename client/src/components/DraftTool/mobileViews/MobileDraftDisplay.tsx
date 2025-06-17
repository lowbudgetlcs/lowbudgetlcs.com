import { IoSearch } from "react-icons/io5";
import { Champion } from "../interfaces/draftInterfaces";
import { ChangeEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDraftContext } from "../providers/DraftProvider";
import { useLocation } from "react-router-dom";
import FearlessNav from "../draftNavbars/FearlessNav";
import { useSettingsContext } from "../providers/SettingsProvider";
import DraftTurnAudio from "../DraftAudio";
import Timer from "../draftViews/Timer";
import RoleSelect from "../draftViews/RoleSelect";
import LoadChampIcons from "../draftViews/LoadChampIcons";
import DisplayPicksMobile from "./DisplayPicksMobile";
import MobileDraftFooter from "./MobileDraftFooter";
import DisplayMobileBans from "./DisplayMobileBans";

function MobileDraftDisplay({ championRoles }: { championRoles: Champion[] }) {
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [footerIsOpen, setFooterIsOpen] = useState<boolean>(false);
  const { draftState, playerSide } = useDraftContext();
  const { teamNameVisible, champIconsVisible } = useSettingsContext();

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

  useEffect(() => {
    if (draftState.displayTurn === playerSide) {
      setFooterIsOpen(true);
    }
  });
  return (
    <div className="draftContainer relative text-white h-screen max-h-screen flex flex-col overflow-hidden">
      {/* Champion Pick Container */}
      <div
        className={`absolute transition delay-0 duration-100 top-0 bg-gray z-[51] ${
          footerIsOpen ? "translate-y-[15%]" : "translate-y-full"
        }`}
      >
        <div className="championPickContainer relative w-screen h-[94vh] flex flex-col">
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
          <div
            className={`relative searchFilter flex justify-between items-center px-6 py-4 max-[1100px]:flex-col-reverse max-[1100px]:gap-4 ${
              champIconsVisible ? "" : "hidden"
            }`}
          >
            <div className="relative champFilter flex gap-4">
              <RoleSelect
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </div>
            <form className="relative bg-light-gray flex items-center rounded-md">
              <label htmlFor="championSearch" className="px-2">
                <IoSearch className="text-3xl" />
              </label>
              <input
                type="text"
                id="championSearch"
                className="champSearch p-2 bg-light-gray focus:border-none rounded-md focus:outline-0"
                placeholder="Search Champion"
                value={searchValue}
                onChange={handleSearchChange}
              ></input>
            </form>
          </div>
          <div
            className={`relative overflow-y-scroll bg-transparent ${
              champIconsVisible ? "" : "hidden"
            }`}
          >
            <div className="relative">
              <ul className="relative champions flex flex-wrap gap-2 justify-center z-10 py-2 max-h-screen">
                <LoadChampIcons
                  championRoles={championRoles}
                  searchValue={searchValue}
                  selectedRole={selectedRole}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Champion Bans*/}
      <div className="champBans relative flex w-full justify-between gap-8 items-center pt-4 pb-2 px-1 mt-auto">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between gap-2 flex-col">
          <DisplayMobileBans playerSide={"blue"} />
        </div>
        {/* Timer */}
        <div className="timer absolute left-0 right-0 bottom-0 text-center text-2xl font-bold">
          <Timer
            timer={draftState.timer}
            displayTurn={draftState.displayTurn}
          />
        </div>
        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-2 max-[1275px]:flex-col-reverse max-[1275px]:items-end">
          <DisplayMobileBans playerSide={"red"} />
        </div>
      </div>
      {/* Team Display Names */}
      <div className="teamTitles relative flex justify-between py-2 px-1">
        <div className={`blueTitle flex items-center gap-1`}>
          <div
            className={`py-2 px-4 ${
              draftState.blueReady || draftState.displayTurn === "blue"
                ? "w-40"
                : "w-32"
            } bg-blue/60 ${
              draftState.displayTurn === "blue" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2
              className={`text-right font-bold text-sm break-words ${
                teamNameVisible ? "" : "text-transparent"
              }`}
            >
              {draftState.blueDisplayName}
            </h2>
          </div>
          <div
            className={`sideIndicator flex gap-1 text-sm items-center ${
              playerSide !== "blue" && "hidden"
            }`}
          >
            <FaArrowLeft />
            <p className="opacity-80">You</p>
          </div>
        </div>
        <div className={`redTitle flex items-center gap-1`}>
          <div
            className={`sideIndicator flex gap-1 text-sm items-center ${
              playerSide !== "red" && "hidden"
            }`}
          >
            <p className="opacity-80">You</p>
            <FaArrowRight />
          </div>
          <div
            className={`py-2 px-4 ${
              draftState.redReady || draftState.displayTurn === "red"
                ? "w-40"
                : "w-32"
            } bg-red/60 ${
              draftState.displayTurn === "red" ? "animate-pulse" : ""
            } transition-width duration-500 rounded-md`}
          >
            <h2
              className={`font-bold text-sm break-words ${
                teamNameVisible ? "" : "text-transparent"
              }`}
            >
              {draftState.redDisplayName}
            </h2>
          </div>
        </div>
      </div>
      {/* Main Container */}
      <div className="relative mainDraftContainer flex h-[70vh] justify-between">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 px-1 pt-2">
          <DisplayPicksMobile
            championRoles={championRoles}
            playerSide={"blue"}
          />
        </div>

        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 px-1 pt-2">
          <DisplayPicksMobile
            championRoles={championRoles}
            playerSide={"red"}
          />
        </div>
      </div>
      <MobileDraftFooter
        footerIsOpen={footerIsOpen}
        setFooterIsOpen={setFooterIsOpen}
      />
      <DraftTurnAudio />
    </div>
  );
}

export default MobileDraftDisplay;
