import { ChangeEvent, useEffect, useState } from "react";
import { connectionHandler, pickHandler, readyHandler } from "./draftHandler";
import { useParams } from "react-router-dom";
import LoadChampIcons from "./LoadChampIcons";
import { io, Socket } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "./clientDraftHandler";

import championsData from "./championRoles.json";
import { Champion, DraftStateProps } from "./draftInterfaces";
import { DisplayPicks, DisplayBans } from "./pickBanDisplay";
import RoleSelect from "./RoleSelect";
import { IoSearch } from "react-icons/io5";

function DraftPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(30);
  const [ready, setReady] = useState<boolean>(false);
  const [chosenChamp, setChosenChamp] = useState<string>();
  const [banPhase, setBanPhase] = useState<boolean>(false);
  const [blueBans, setBlueBans] = useState<string[]>([]);
  const [redBans, setRedBans] = useState<string[]>([]);
  const [bluePicks, setBluePicks] = useState<string[]>([]);
  const [redPicks, setRedPicks] = useState<string[]>([]);
  const [pickPhase, setPickPhase] = useState<boolean>(false);
  const [championRoles, setChampionRoles] = useState<Champion[]>([]);
  const [draftState, setDraftState] = useState<DraftStateProps>();
  const [blueReady, setBlueReady] = useState<boolean>(false);
  const [redReady, setRedReady] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<string | null>("");
  const [playerSide, setPlayerSide] = useState<string>("");

  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");

  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    setChampionRoles(championsData);

    console.log("lobby code: ", lobbyCode);

    // Run connection Handler Function with lobby code
    const handleConnection = async () => {
      connectionHandler(
        lobbyCode,
        sideCode,
        newSocket,
        setBlueReady,
        setRedReady,
        setPlayerSide
      );
    };
    newSocket.on("connect", handleConnection);

    // Cleanup on unmount
    return () => {
      newSocket.off("connect", handleConnection);
      newSocket.disconnect();
    };
  }, [lobbyCode, sideCode]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const reconnectionHandler = (state: DraftStateProps) => {
      setDraftState(state);
      if (state.blueBans.length > 0) {
        setBlueBans(state.blueBans);
      }
      if (state.redBans.length > 0) {
        setRedBans(state.redBans);
      }
      if (state.bluePicks.length > 0) {
        setBluePicks(state.bluePicks);
      }
      if (state.redPicks.length > 0) {
        setRedPicks(state.redPicks);
      }
      if (state.phaseType === "pick") {
        setPickPhase(true);
        handlePickPhase(
          setCurrentTime,
          socket,
          bluePicks,
          redPicks,
          setBluePicks,
          setRedPicks,
          state,
          setDraftState
        );
      } else if (state.phaseType === "ban") {
        setBanPhase(true);
        handleBanPhase(
          setCurrentTime,
          socket,
          blueBans,
          redBans,
          setBlueBans,
          setRedBans,
          state,
          setDraftState
        );
      }

      setPlayerTurn(state.displayTurn);
    };
    socket.on("state", reconnectionHandler);

    return () => {
      socket.off("state", reconnectionHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !draftState) {
      return;
    }
    const startBanPhase = (state: DraftStateProps) => {
      setDraftState(state);
      setPickPhase(false);
      setBanPhase(true);
      handleBanPhase(
        setCurrentTime,
        socket,
        blueBans,
        redBans,
        setBlueBans,
        setRedBans,
        draftState,
        setDraftState
      );
    };

    const startPickPhase = (state: DraftStateProps) => {
      setDraftState(state);
      setPickPhase(true);
      setBanPhase(false);
      handlePickPhase(
        setCurrentTime,
        socket,
        bluePicks,
        redPicks,
        setBluePicks,
        setRedPicks,
        draftState,
        setDraftState
      );
    };

    // Listening for beginning of phases
    socket.on("banPhase", startBanPhase);
    socket.on("pickPhase", startPickPhase);

    return () => {
      socket.off("banPhase", startBanPhase);
      socket.off("pickPhase", startPickPhase);
    };
  }, [socket, draftState]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const handleCurrentTurn = (state: DraftStateProps) => {
      setPlayerTurn(state.displayTurn);
    };
    socket.on("currentTurn", handleCurrentTurn);

    return () => {
      socket.off("currentTurn", handleCurrentTurn);
    };
  }, [socket]);

  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(lobbyCode, sideCode, newReady, socket);
      return newReady;
    });
  };

  const sendPick = (chosenChamp: string) => {
    pickHandler(lobbyCode, sideCode, chosenChamp, socket, banPhase, pickPhase);
    console.log(draftState);
    console.log(draftState?.activePhase);
    setChosenChamp("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative text-white py-2  h-full flex flex-col">
      <div className="timer absolute top-[2%] left-1/2 transform -translate-x-1/2 text-center text-2xl font-bold">
        <p
          className={`${
            playerTurn === "blue"
              ? "text-blue"
              : playerTurn === "red"
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
            blueReady || playerTurn === "blue" ? "w-96" : "w-52"
          } bg-blue/60 ${
            playerTurn === "blue" ? "animate-pulse" : ""
          } transition-width duration-500`}
        >
          <h2>Blue Team</h2>
        </div>
        <div
          className={`redTitle py-2 px-4 ${
            redReady || playerTurn === "red" ? "w-96" : "w-52"
          } bg-red/60 ${
            playerTurn === "red" ? "animate-pulse" : ""
          } transition-width duration-500`}
        >
          <h2>Red Team</h2>
        </div>
      </div>
      {/* Main Container */}
      <div className="relative mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 p-4">
          <DisplayPicks
            picks={bluePicks}
            championRoles={championRoles}
            playerTurn={playerTurn}
            playerSide={"blue"}
            currentPhase={draftState?.activePhase}
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
                pickedChampions={bluePicks.concat(redPicks)}
                bannedChampions={blueBans.concat(redBans)}
                chosenChamp={chosenChamp}
                setChosenChamp={setChosenChamp}
              />
            </ul>
          </div>
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 p-4">
          <DisplayPicks
            picks={redPicks}
            championRoles={championRoles}
            playerTurn={playerTurn}
            playerSide={"red"}
            currentPhase={draftState?.activePhase}
          />
        </div>
      </div>
      {/* Champion Bans*/}
      <div className="champBans flex w-full justify-between gap-8 items-center py-8 px-4">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4">
          <DisplayBans
            bans={blueBans}
            side={"blue"}
            playerTurn={playerTurn}
            currentPhase={draftState?.activePhase}
          />
        </div>
        {/* Ready Button */}
        {draftState?.activePhase !== "finished" ? (
          <button
            onClick={toggleReady}
            className={`p-4 ${ready ? "bg-gray" : "bg-orange"} ${
              banPhase || pickPhase ? "hidden" : ""
            } max-h-16 flex items-center justify-center hover:cursor-pointer`}
          >
            {ready ? "Waiting" : "Ready"}
          </button>
        ) : (
          <button
            className={`Timer p-4 bg-gray ${
              banPhase || pickPhase ? "hidden" : ""
            } max-h-16 flex items-center justify-center hover:cursor-default`}
          >
            Draft Finished
          </button>
        )}
        {/* Pick/Ban Button */}
        {playerTurn === playerSide ? (
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
            bans={redBans}
            side={"red"}
            playerTurn={playerTurn}
            currentPhase={draftState?.activePhase}
          />
        </div>
      </div>
    </div>
  );
}

export default DraftPage;
