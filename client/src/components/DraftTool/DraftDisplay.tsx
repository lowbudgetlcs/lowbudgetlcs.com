import { IoSearch } from "react-icons/io5";
import DisplayBans from "./DisplayBans";
import RoleSelect from "./RoleSelect";
import LoadChampIcons from "./LoadChampIcons";
import { DraftDisplayProps, DraftProps } from "./draftInterfaces";
import { ChangeEvent, useEffect, useState } from "react";
import DraftButton from "./DraftButton";
import Timer from "./Timer";
import DisplayPicks from "./DisplayPicks";
import { useSocketContext } from "./DraftPage";

function DraftDisplay({
  draftState,
  lobbyCode,
  sideCode,
  championRoles,
  playerSide,
}: DraftDisplayProps) {
  const { socket } = useSocketContext();
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [chosenChamp, setChosenChamp] = useState<string>();

  const [currentHover, setCurrentHover] = useState<string | null>(null);

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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <div className="relative text-white max-h-screen flex flex-col py-2 max-[1275px]:pt-2 max-[1275px]:py-0">
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
      {/* Main Container */}
      <div className="relative mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 draftMd:p-4 p-0 px-2 py-4">
          <DisplayPicks
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
        {/* Champion Pick Container */}
        <div className="championPickContainer relative w-full">
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
          <div className="relative searchFilter flex justify-between items-center px-6 py-4 max-[1100px]:flex-col-reverse max-[1100px]:gap-4">
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
          <div className="relative h-[616px] max-[1100px]:h-[580px] overflow-y-scroll bg-transparent">
            <div className="relative">
              <ul className="relative champions flex flex-wrap gap-2 justify-center z-10">
                <LoadChampIcons
                  championRoles={championRoles}
                  searchValue={searchValue}
                  selectedRole={selectedRole}
                  pickedChampions={draftState.bluePicks.concat(
                    draftState.redPicks
                  )}
                  bannedChampions={draftState.blueBans.concat(
                    draftState.redBans
                  )}
                  chosenChamp={chosenChamp}
                  setChosenChamp={setChosenChamp}
                />
              </ul>
            </div>
          </div>
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 draftMd:p-4 p-0 px-2 py-4">
          <DisplayPicks
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
      {/* Champion Bans*/}
      <div className="champBans flex w-full justify-between gap-8 items-center pt-8 max-[1100px]:pt-4 px-4">
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
        <DraftButton
          draftState={draftState}
          lobbyCode={lobbyCode}
          sideCode={sideCode}
          championRoles={championRoles}
          playerSide={playerSide}
          chosenChamp={chosenChamp}
          setChosenChamp={setChosenChamp}
        />

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
    </div>
  );
}

export default DraftDisplay;
