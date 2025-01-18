import { useEffect, useState } from "react";
import { connectionHandler, pickHandler, readyHandler } from "./draftHandler";
import { useParams } from "react-router-dom";
import { loadChampImages, loadLargeChampImages } from "./loadChampImages";
import { io, Socket } from "socket.io-client";
import { handleBanPhase, handlePickPhase } from "./clientDraftHandler";
import tempImage from "../../assets/Transparent_LBLCS_Logo.png";

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
  const [bannedChampions, setBannedChampions] = useState<Array<string>>([]);
  const [pickPhase, setPickPhase] = useState<boolean>(false);
  const [pickedChampions, setPickedChampions] = useState<Array<string>>([]);
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

    console.log("lobby code: ", lobbyCode);

    // Run connection Handler Function with lobby code
    const handleConnection = async () => {
      connectionHandler(lobbyCode, sideCode, newSocket);
    };
    newSocket.on("connect", handleConnection);

    // Listening for beginning of banPhase
    newSocket.on("banPhase", () => {
      setPickPhase(false);
      setBanPhase(true);
      handleBanPhase(setCurrentTime, sideCode, newSocket, setBannedChampions);
    });

    newSocket.on("pickPhase", () => {
      setBanPhase(false);
      setPickPhase(true);
      handlePickPhase(setCurrentTime, sideCode, newSocket, setPickedChampions);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off("connect", handleConnection);
      newSocket.off("banPhase", handleBanPhase);
      newSocket.disconnect();
    };
  }, [lobbyCode, sideCode]);

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
    setChosenChamp(championName);
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
          <div className="pick4 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick5 min-w-40 min-h-24 bg-gray"></div>
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer flex flex-col ">
          <div className="searchFilter flex justify-between">
            <div className="champFilter flex gap-2"></div>
            <form>
              <input
                type="text"
                className="champSearch bg-gray"
                placeholder="Search Champion"
              ></input>
            </form>
          </div>
          {/* List of Champion Images */}
          <ul className="champions flex flex-wrap overflow-y-scroll max-h-[640px] p-4 gap-2 justify-center">
            {Object.entries(champImages).map(([name, src]) => {
              return (
                <li
                  key={name}
                  onClick={() => handlePick(name)}
                  className={`${
                    chosenChamp === name ? "border-orange border-2" : ""
                  }`}
                >
                  <img
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
          <div className="pick4 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick5 min-w-40 min-h-24 bg-gray"></div>
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
          <div className="ban4 w-20 h-40 bg-gray overflow-hidden"></div>
          <div className="ban5 w-20 h-40 bg-gray overflow-hidden"></div>
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
          <div className="ban5 w-20 h-40 bg-gray overflow-hidden"></div>
          <div className="ban4 w-20 h-40 bg-gray overflow-hidden"></div>
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
