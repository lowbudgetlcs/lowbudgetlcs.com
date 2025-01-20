import { ChangeEvent, useEffect, useState } from "react";
import { connectionHandler, pickHandler, readyHandler } from "./draftHandler";
import { useParams } from "react-router-dom";
import { loadChampImages, loadLargeChampImages } from "./loadChampImages";
import { io, Socket } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "./clientDraftHandler";
import tempImage from "../../assets/Transparent_LBLCS_Logo.png";
import championsData from "./championRoles.json";

export interface Champion {
  name: string;
  roles: string[];
}

function DraftPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [champImages, setChampImages] = useState<Record<string, string>>({});
  const [largeChampImages, setLargeChampImages] = useState<
    Record<string, string>
  >({});
  const [currentTime, setCurrentTime] = useState<number>(30);
  const [ready, setReady] = useState<boolean>(false);
  const [chosenChamp, setChosenChamp] = useState<string>();
  const [banPhase, setBanPhase] = useState<boolean>(false);
  const [bannedChampions, setBannedChampions] = useState<string[]>([]);
  const [pickPhase, setPickPhase] = useState<boolean>(false);
  const [pickedChampions, setPickedChampions] = useState<string[]>([]);
  const [championRoles, setChampionRoles] = useState<Champion[]>([]);

  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");

  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    // Fetch Champion Images
    const fetchChampImages = async () => {
      try {
        const data = await loadChampImages();
        setChampImages(data);
        const largeData = await loadLargeChampImages();
        setLargeChampImages(largeData);
      } catch (error) {
        console.error("Error loading champion images:", error);
      }
    };
    fetchChampImages();

    setChampionRoles(championsData);

    console.log("lobby code: ", lobbyCode);

    // Run connection Handler Function with lobby code
    const handleConnection = async () => {
      connectionHandler(lobbyCode, sideCode, newSocket);
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
    // Listening for beginning of banPhase
    socket.on("banPhase", () => {
      setPickPhase(false);
      setBanPhase(true);
      handleBanPhase(setCurrentTime, sideCode, socket!, setBannedChampions);
    });

    socket.on("pickPhase", () => {
      setBanPhase(false);
      setPickPhase(true);
      handlePickPhase(setCurrentTime, sideCode, socket!, setPickedChampions);
    });

    return () => {
      socket.off("banPhase", handleBanPhase);
      socket.off("pickPhase", handlePickPhase);
    };
  }, [socket, sideCode]);

  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(lobbyCode, sideCode, newReady, socket);
      return newReady;
    });
  };

  const sendPick = (chosenChamp: string) => {
    pickHandler(lobbyCode, sideCode, chosenChamp, socket, banPhase, pickPhase);
  };

  const handlePick = (championName: string) => {
    if (
      !pickedChampions.includes(championName) &&
      !pickedChampions.includes(championName)
    ) {
      setChosenChamp(championName);
    }
  };

  const displayBanImage = (banIndex: number) => {
    if (bannedChampions[banIndex] === "nothing") {
      return (
        <img
          src={tempImage}
          alt={`nothing`}
          style={{
            width: "160px",
            height: "200px",
            objectFit: "cover",
          }}
        />
      );
    } else {
      return (
        <>
          {bannedChampions[banIndex] && (
            <img
              src={largeChampImages[bannedChampions[banIndex]]}
              alt={`${bannedChampions[banIndex]}`}
              style={{
                width: "160px",
                height: "200px",
                objectFit: "cover",
              }}
            />
          )}
        </>
      );
    }
  };
  const displayPickImage = (pickIndex: number) => {
    if (pickedChampions[pickIndex] === "nothing") {
      return (
        <img
          src={tempImage}
          alt={`nothing`}
          style={{
            width: "300px",
            height: "100px",
            objectFit: "cover",
          }}
        />
      );
    } else {
      return (
        <>
          {pickedChampions[pickIndex] && (
            <img
              src={largeChampImages[pickedChampions[pickIndex]]}
              alt={`${pickedChampions[pickIndex]}`}
              style={{
                width: "300px",
                height: "100px",
                objectFit: "cover",
              }}
            />
          )}
        </>
      );
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative text-white mt-2">
      <div className="timer absolute top-[2%] left-1/2 transform -translate-x-1/2 text-center text-2xl font-bold">
        <p>{currentTime}</p>
      </div>
      <div className="teamTitles flex justify-between">
        <div className="blueTitle p-4 bg-blue/60">
          <h2>Blue Team</h2>
        </div>
        <div className="redTitle p-4 bg-red/60">
          <h2>Red Team</h2>
        </div>
      </div>
      {/* Main Container */}
      <div className="relative mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 p-4">
          <div className="pick1 min-w-40 min-h-24 bg-gray">
            {displayPickImage(0)}
          </div>
          <div className="pick2 min-w-40 min-h-24 bg-gray">
            {displayPickImage(3)}
          </div>
          <div className="pick3 min-w-40 min-h-24 bg-gray">
            {displayPickImage(4)}
          </div>
          <div className="space h-4"></div>
          <div className="pick4 min-w-40 min-h-24 bg-gray">
            {displayPickImage(7)}
          </div>
          <div className="pick5 min-w-40 min-h-24 bg-gray">
            {displayPickImage(8)}
          </div>
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer flex flex-col w-full ">
          <div className="searchFilter flex justify-between">
            <div className="champFilter flex gap-2">
              {["All", "Top", "Jungle", "Mid", "Bottom", "Support"].map((role) => (
                <label key={role} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
            <form>
              <input
                type="text"
                className="champSearch bg-gray"
                placeholder="Search Champion"
                value={searchValue}
                onChange={handleSearchChange}
              ></input>
            </form>
          </div>
          {/* List of Champion Images */}
          <ul className="champions flex flex-wrap overflow-y-scroll max-h-[640px] p-4 gap-2 justify-center">
            {Object.entries(champImages)
              .filter(([name]) => {
                const matchesSearch = name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());

                if (selectedRole === "All") {
                  return matchesSearch;
                }

                const champion = championRoles.find(
                  (champ) => champ.name === name
                );
                if (!champion) return false;

                const hasSelectedRole = champion.roles.includes(selectedRole);

                return matchesSearch && hasSelectedRole;
              })
              .map(([name, src]) => {
                return (
                  <li
                    key={name}
                    onClick={() => {
                      if (
                        !pickedChampions.includes(name) &&
                        !bannedChampions.includes(name)
                      ) {
                        handlePick(name);
                      }
                    }}
                  >
                    <img
                      className={`
                      ${
                        pickedChampions.includes(name) ||
                        bannedChampions.includes(name)
                          ? "grayscale"
                          : "hover:cursor-pointer"
                      } 
                      ${
                        chosenChamp === name
                          ? "box-border border-orange border-2"
                          : ""
                      }`}
                      src={src}
                      alt={name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                      }}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 p-4">
          <div className="pick1 min-w-40 min-h-24 bg-gray">
            {displayPickImage(1)}
          </div>
          <div className="pick2 min-w-40 min-h-24 bg-gray">
            {displayPickImage(2)}
          </div>
          <div className="pick3 min-w-40 min-h-24 bg-gray">
            {displayPickImage(5)}
          </div>
          <div className="space h-4"></div>
          <div className="pick4 min-w-40 min-h-24 bg-gray">
            {displayPickImage(6)}
          </div>
          <div className="pick5 min-w-40 min-h-24 bg-gray">
            {displayPickImage(9)}
          </div>
        </div>
      </div>
      {/* Champion Band and Timer */}
      <div className="champBansTimer flex w-full justify-between gap-8 items-center px-4">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4">
          <div className="ban1 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(0)}
          </div>
          <div className="ban2 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(2)}
          </div>
          <div className="ban3 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(4)}
          </div>
          <div className="space w-8"></div>
          <div className="ban4 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(7)}
          </div>
          <div className="ban5 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(9)}
          </div>
        </div>
        {/* Ready Button */}
        <button
          onClick={toggleReady}
          className={`Timer p-4 ${ready ? "bg-gray" : "bg-orange"} ${
            banPhase || pickPhase ? "hidden" : ""
          } max-h-16 flex items-center justify-center hover:cursor-pointer`}
        >
          {ready ? "Waiting" : "Ready"}
        </button>
        {/* Pick/Ban Button */}
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
        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-4">
          <div className="ban5 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(8)}
          </div>
          <div className="ban4 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(6)}
          </div>
          <div className="space w-8"></div>
          <div className="ban3 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(5)}
          </div>
          <div className="ban2 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(3)}
          </div>
          <div className="ban1 w-20 h-40 bg-gray overflow-hidden">
            {displayBanImage(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraftPage;
