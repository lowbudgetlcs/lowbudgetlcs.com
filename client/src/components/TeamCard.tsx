import { useState } from "react";

const commercialGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-platinum-light to-platinum-dark";
const financialGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-emerald-light to-emerald-dark";
const economyGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-gold-light to-gold-dark";
const executiveGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-challenger-blue to-challenger-gold";

interface TeamProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
}

function TeamCard({
  teamName,
  groupId,
  logo,
  playerList,
  divisionId,
}: TeamProps) {
  const [playerListVisible, setPlayerListVisible] = useState(false);
  let gradient;
  const togglePlayerList = () => {
    setPlayerListVisible(!playerListVisible);
  };

  switch (divisionId) {
    case 1:
      gradient = economyGradient;
      break;
    case 2:
      gradient = commercialGradient;
      break;
    case 3:
      gradient = financialGradient;
      break;
    case 4:
      gradient = executiveGradient;
      break;
  }

  return (
    <div
      className={`teamCard relative transition duration-300 ${
        playerListVisible ? "rounded-t-lg" : "rounded-lg"
      } bg-gray/80 dark:bg-gray/40`}
    >
      <div className="dropBtn absolute bottom-0 right-0 self-end">
        <div
          onClick={togglePlayerList}
          className="burger cursor-pointer relative h-12 w-12 gap-1 hover:cursor-pointer self-baseline"
        >
          <div
            className={`absolute ${
              playerListVisible ? "-rotate-45" : "rotate-45"
            } top-4 -left-0 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
          ></div>
          <div
            className={`absolute ${
              playerListVisible ? "rotate-45" : "-rotate-45"
            } top-4 left-4 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
          ></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row py-4 md:py-0 md:pl-4 gap-4 items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden">
        <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
          <div className="logo flex-shrink-0 w-[150px] text-center text-3xl h-[150px] bg-gray">
            {logo || "No logo :)"}
          </div>
          <div className={`w-full h-3 md:w-3 md:h-full ${gradient}`}></div>
        </div>
        <div className="flex flex-col md:flex-row flex-1 flex-shrink md:ml-4 items-center">
            <h3 className="teamName text-xl text-center font-semibold">
              {teamName}
            </h3>
        </div>
        <div className="teamGroupContainer">
          <div className="teamGroup text-center md:text-right md:mr-20">Group: {groupId}</div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`teamMembers absolute left-0 right-0 overflow-hidden bg-light-gray dark:bg-gray-800 shadow-lg rounded-b-lg z-10 transition-all duration-500 ease-in-out ${
            playerListVisible
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <h3 className="text-2xl font-bold text-center">Players</h3>
          <div className="players grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-4">
            {playerList.map((player) => {
              const summonerName = player.split("#");
              return (
                <div key={player} className="text-center">
                  {summonerName[0]}{" "}
                  <span className="text-white/40">{"#" + summonerName[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
