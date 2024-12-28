import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GameStatsProps, handleTeamSearch } from "./StatsTeam";
interface StatsProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
  isOpen: boolean;
  onToggle: () => void;
}

function StatsTeamUI() {
  const { teamName, groupId, divisionId, logo, playerList }: StatsProps =
    useLocation().state;
  const [activeLink, setActiveLink] = useState<string>("Details");
  const [gameList, setGameList] = useState<Array<GameStatsProps>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const teamID: number = Number(useParams().team);
  const navigate = useNavigate();
  useEffect(() => {
    const getTeamStats = async () => {
      try {
        setLoading(true)
        const teamArray: Array<GameStatsProps> = await handleTeamSearch(
          teamID,
          setError
        );
        console.log(teamArray);
        setGameList(teamArray);
      } catch (err) {
        console.error("Failed getting Team Stats: " + error);
      } finally {
        setLoading(false)
      }
    };
    getTeamStats();
  }, [teamID]);
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  return (
    <>
      <div className="statsTeamTitle text-white min-h-64 mb-16 mt-40 sm:mt-24 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {logo ? (
          <img
            src={logo}
            className="teamLogo w-[160px] h-[160px] text-center"
          ></img>
        ) : (
          <div className="placeholderImg min-w-[160px] min-h-[160px] bg-gray text-center"></div>
        )}

        <h1 className="text-6xl text-center text-white">{teamName}</h1>
      </div>
      <div className="navList text-white">
        <ul className="relative flex gap-4 text-sm sm:text-base md:text-2xl font-semibold justify-center p-4">
          <li
            onClick={() => toggleActive("Details")}
            className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
          >
            Details
            <span
              className={`line absolute ${
                activeLink === "Details" ? "w-full" : "w-0"
              } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 right-0`}
            ></span>
          </li>
          <li
            onClick={() => toggleActive("History")}
            className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
          >
            Match History
            <span
              className={`line absolute ${
                activeLink === "History" ? "w-full" : "w-0"
              } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
            ></span>
          </li>
        </ul>
      </div>
      {!loading ? (
        activeLink === "Details" ? (
          gameList.length > 0 ? (
            <Details gameList={gameList} />
          ) : (
            <p className="text-xl text-white font-bold">No games found for this team. Please try reloading</p>
          )
        ) : activeLink === "History" ? (
          <MatchHistory />
        ) : null
      ) : (
        <div className="animate-spin border-b-2 border-l-2 border-t-2 border-orange rounded-full p-3"></div>
      )}
    </>
  );
}

function Details({ gameList }: { gameList: Array<GameStatsProps> }) {
  const teamCalculations = useMemo(() => {
    let wins: number = 0;
    const totalGames: number = gameList.length;
    gameList.forEach((game) => {
      if (game.win) {
        wins++;
      }
    });
    const winLossRatio: number = Number(((wins / totalGames) * 100).toFixed(0));

    return { winLossRatio };
  }, [gameList]);
  return (
    <div className="detailsSection text-white">
      <div className="statContainer">
        <p className="winLossRatio">
          Win/Loss {teamCalculations.winLossRatio}%
        </p>
      </div>
    </div>
  );
}

function MatchHistory() {
  return "eee";
  // <div className="matchHistorySection">
  //   <div
  //     key={game.id}
  //     className="gameContainer w-full md:h-44 py-8 bg-gray flex flex-col md:flex-row rounded-md lg:max-w-full flex-grow"
  //   >
  //     <div className="gameInfo flex flex-col items-center justify-center gap-2 py-2 w-full md:w-24 px-4 text-left">
  //       <h2>{game.win ? "Win" : "Loss"}</h2>
  //       <div className="line h-1 w-16 rounded-md bg-orange"></div>
  //       <h2>{handleTime(game.gameLength)}</h2>
  //     </div>
  //     <div className="champKDA flex flex-col gap-2 py-2 items-center justify-center w-full md:w-16 lg:w-32 text-left">
  //       <img
  //         src={champImageSrc}
  //         alt={game.championName}
  //         className="champion min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] bg-dark-blue"
  //       />
  //       <p className="text-xl font-semibold">
  //         {game.kills}/{game.deaths}/{game.assists}
  //       </p>
  //     </div>
  //     {/* Container to align stats consistently across all screen sizes */}
  //     <div className="fullStats flex flex-col md:flex-row gap-4 items-center justify-center w-fit md:w-1/2 text-left m-auto md:m-4 pt-4 flex-grow">
  //       <div className="statsContainer flex flex-col gap-2 md:flex-row w-full items-center">
  //         <div className="goldStats flex flex-col gap-2 items-start justify-center w-full md:w-2/5">
  //           <p className="text-sm">
  //             CS: <span className="text-white/60">{game.cs}</span>
  //           </p>
  //           <p className="text-sm">
  //             CS/m:{" "}
  //             <span className="text-white/60">
  //               {(game.cs / 60).toFixed(1)}
  //             </span>
  //           </p>
  //           <p className="text-sm">
  //             Gold: <span className="text-white/60">{game.gold}</span>
  //           </p>
  //           <p className="text-sm">
  //             Vision Score:{" "}
  //             <span className="text-white/60">{game.visionScore}</span>
  //           </p>
  //         </div>
  //         <div className="damageStats flex flex-col gap-2 items-start justify-center w-full md:w-1/3 flex-grow">
  //           <p className="text-sm">
  //             Damage: <span className="text-white/60">{game.damage}</span>
  //           </p>
  //           <p className="text-sm">
  //             Healing: <span className="text-white/60">{game.healing}</span>
  //           </p>
  //           <p className="text-sm">
  //             Shielding:{" "}
  //             <span className="text-white/60">{game.shielding}</span>
  //           </p>
  //           <p className="text-sm">
  //             Damage Taken:{" "}
  //             <span className="text-white/60">{game.damageTaken}</span>
  //           </p>
  //           <p className="text-sm">
  //             Self-Mitigated:{" "}
  //             <span className="text-white/60">
  //               {game.selfMitigatedDamage}
  //             </span>
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
}
export default StatsTeamUI;
