import { useEffect, useState } from "react";
import { connectionHandler, readyHandler } from "./draftHandler";
import { useParams } from "react-router-dom";
import { loadChampImages } from "./loadChampImages";
import { connect, io, Socket } from "socket.io-client";

function DraftPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [champImages, setChampImages] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<boolean>(false);

  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    const fetchChampImages = async () => {
      try {
        const data = await loadChampImages();
        setChampImages(data);
      } catch (error) {
        console.error("Error loading champion images:", error);
      }
    };
    fetchChampImages();

    console.log("lobby code: ", lobbyCode);
    // Run connection Handler Function with lobby code
    const handleConnection = async () => {
      connectionHandler(lobbyCode, sideCode, newSocket);
    }
    newSocket.on("connect", handleConnection);
    newSocket.on("startDraft", () => {
      console.log("Draft is starting");
    });


    // Cleanup on unmount
    return () => {
      newSocket.off("connect", handleConnection);
      newSocket.off("startDraft");
      newSocket.disconnect();
    };
  }, [lobbyCode, sideCode]);
  const toggleReady = () => {
    setReady((prevReady) => {
      const newReady = !prevReady;
      readyHandler(sideCode, newReady, socket);
      return newReady;
    });
  };

  return (
    <div className="mt-24 text-white">
      <div className="teamTitles flex justify-between">
        <div className="blueTitle p-4 bg-blue/60">
          <h2>Blue Team</h2>
        </div>
        <div className="redTitle p-4 bg-red/60">
          <h2>Red Team</h2>
        </div>
      </div>
      {/* Main Container */}
      <div className="mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 p-4">
          <div className="pick1 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick2 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick3 min-w-40 min-h-24 bg-gray"></div>
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
                <li key={name}>
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
          <div className="pick1 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick2 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick3 min-w-40 min-h-24 bg-gray"></div>
          <div className="space h-4"></div>
          <div className="pick4 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick5 min-w-40 min-h-24 bg-gray"></div>
        </div>
      </div>
      {/* Champion Band and Timer */}
      <div className="champBansTimer flex w-full justify-between gap-8 items-center px-4">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4">
          <div className="ban1 w-20 h-40 bg-gray"></div>
          <div className="ban2 w-20 h-40 bg-gray"></div>
          <div className="ban3 w-20 h-40 bg-gray"></div>
          <div className="space w-8"></div>
          <div className="ban4 w-20 h-40 bg-gray"></div>
          <div className="ban5 w-20 h-40 bg-gray"></div>
        </div>
        {/* Ready Button */}
        <button
          onClick={toggleReady}
          className={`Timer p-4 ${
            ready ? "bg-gray" : "bg-orange"
          } max-h-16 flex items-center justify-center hover:cursor-pointer`}
        >
          {ready ? "Waiting" : "Ready"}
        </button>
        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-4">
          <div className="ban5 w-20 h-40 bg-gray"></div>
          <div className="ban4 w-20 h-40 bg-gray"></div>
          <div className="space w-8"></div>
          <div className="ban3 w-20 h-40 bg-gray"></div>
          <div className="ban2 w-20 h-40 bg-gray"></div>
          <div className="ban1 w-20 h-40 bg-gray"></div>
        </div>
      </div>
    </div>
  );
}

export default DraftPage;
