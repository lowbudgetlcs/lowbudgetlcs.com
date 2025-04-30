import { IoSearch } from "react-icons/io5";
import { DisplayBans, DisplayPicks } from "./pickBanDisplay";
import RoleSelect from "./RoleSelect";
import LoadChampIcons from "./LoadChampIcons";
import { DraftDisplayProps } from "./draftInterfaces";
import { ChangeEvent, useEffect, useState } from "react";
import { pickHandler, readyHandler } from "./draftHandler";

function DraftDisplay({
  draftState,
  lobbyCode,
  sideCode,
  socket,
  championRoles,
  banPhase,
  pickPhase,
  playerSide,
}: DraftDisplayProps) {
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [ready, setReady] = useState<boolean>(false);
  const [chosenChamp, setChosenChamp] = useState<string>();
  const [currentTime, setCurrentTime] = useState<number>(30);
  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(lobbyCode, sideCode, newReady, socket);
      return newReady;
    });
  };

  const sendPick = (chosenChamp: string) => {
    pickHandler(lobbyCode, sideCode, chosenChamp, socket, banPhase, pickPhase);
    setChosenChamp("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (draftState.timer > 30) {
      setCurrentTime(30);
    } else {
      setCurrentTime(draftState.timer);
    }
  }, [draftState.timer]);

  return (
    <div className="relative text-white py-2  h-full flex flex-col">
      <div className="timer absolute top-[2%] left-1/2 transform -translate-x-1/2 text-center text-2xl font-bold">
        <p
          className={`${
            draftState.displayTurn === "blue"
              ? "text-blue"
              : draftState.displayTurn === "red"
              ? "text-red"
              : ""
          }`}
        >
          {currentTime}
        </p>
      </div>
      <div className="teamTitles flex justify-between px-4">
        <div
          className={`blueTitle py-2 px-4 ${
            draftState.blueReady || draftState.displayTurn === "blue"
              ? "w-96"
              : "w-52"
          } bg-blue/60 ${
            draftState.displayTurn === "blue" ? "animate-pulse" : ""
          } transition-width duration-500`}
        >
          <h2>{draftState.blueDisplayName}</h2>
        </div>
        <div
          className={`redTitle py-2 px-4 ${
            draftState.redReady || draftState.displayTurn === "red"
              ? "w-96"
              : "w-52"
          } bg-red/60 ${
            draftState.displayTurn === "red" ? "animate-pulse" : ""
          } transition-width duration-500`}
        >
          <h2>{draftState.redDisplayName}</h2>
        </div>
      </div>
      {/* Main Container */}
      <div className="relative mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 p-4">
          <DisplayPicks
            picks={draftState.bluePicks}
            championRoles={championRoles}
            playerTurn={draftState.displayTurn}
            playerSide={"blue"}
            currentPhase={draftState.activePhase}
          />
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer flex flex-col w-full ">
          <div className="searchFilter flex justify-between items-center px-6 py-4">
            <div className="champFilter flex gap-4">
              <RoleSelect
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </div>
            <form className="bg-gray flex items-center">
              <label htmlFor="championSearch">
                <IoSearch className="text-3xl" />
              </label>
              <input
                type="text"
                id="championSearch"
                className="champSearch p-2 bg-gray focus:ring-0 focus:border-none"
                placeholder="Search Champion"
                value={searchValue}
                onChange={handleSearchChange}
              ></input>
            </form>
          </div>
          {/* List of Champion Images */}
          <div>
            <ul className="champions flex flex-wrap overflow-y-scroll max-h-[640px] gap-2 justify-center">
              <LoadChampIcons
                championRoles={championRoles}
                searchValue={searchValue}
                selectedRole={selectedRole}
                pickedChampions={draftState.bluePicks.concat(
                  draftState.redPicks
                )}
                bannedChampions={draftState.blueBans.concat(draftState.redBans)}
                chosenChamp={chosenChamp}
                setChosenChamp={setChosenChamp}
              />
            </ul>
          </div>
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 p-4">
          <DisplayPicks
            picks={draftState.redPicks}
            championRoles={championRoles}
            playerTurn={draftState.displayTurn}
            playerSide={"red"}
            currentPhase={draftState.activePhase}
          />
        </div>
      </div>
      {/* Champion Bans*/}
      <div className="champBans flex w-full justify-between gap-8 items-center py-8 px-4">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4">
          <DisplayBans
            bans={draftState.blueBans}
            side={"blue"}
            playerTurn={draftState.displayTurn}
            currentPhase={draftState.activePhase}
          />
        </div>
        {/* Ready Button */}
        {draftState.draftComplete === true ? (
          <button
            className={`Timer p-4 bg-gray ${
              banPhase || pickPhase ? "hidden" : ""
            } max-h-16 flex items-center justify-center hover:cursor-default`}
          >
            Draft Finished
          </button>
        ) : (
          <button
            onClick={toggleReady}
            className={`p-4 ${ready ? "bg-gray" : "bg-orange"} ${
              banPhase || pickPhase ? "hidden" : ""
            } max-h-16 flex items-center justify-center hover:cursor-pointer`}
          >
            {ready ? "Waiting" : "Ready"}
          </button>
        )}
        {/* Pick/Ban Button */}
        {draftState.displayTurn === playerSide ? (
          <button
            onClick={() => {
              if (chosenChamp) {
                sendPick(chosenChamp);
              }
            }}
            className={`Timer p-4 ${chosenChamp ? "bg-orange" : "bg-gray"} ${
              banPhase || pickPhase ? "" : "hidden"
            } max-h-16 flex items-center justify-center hover:cursor-pointer`}
          >
            Lock In
          </button>
        ) : (
          <button
            className={`Timer p-4 bg-gray ${
              banPhase || pickPhase ? "" : "hidden"
            } max-h-16 flex items-center justify-center hover:cursor-wait`}
          >
            Waiting Turn
          </button>
        )}
        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-4">
          <DisplayBans
            bans={draftState.redBans}
            side={"red"}
            playerTurn={draftState.displayTurn}
            currentPhase={draftState.activePhase}
          />
        </div>
      </div>
    </div>
  );
}

export default DraftDisplay;
