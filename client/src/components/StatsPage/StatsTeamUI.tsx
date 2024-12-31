import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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

interface RosterProps {
  id: number;
  playerName: string;
}

interface ChampionProps {
  championName: string;
  gamesPlayed: number;
}

interface ChampImagesProps {}

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
    // fetches team stats by id given and sets the error if there is one
    const getTeamStats = async () => {
      try {
        setLoading(true);
        const teamArray: Array<GameStatsProps> = await handleTeamSearch(
          teamID,
          setError
        );
        console.log(teamArray);
        setGameList(teamArray);
      } catch (err) {
        console.error("Failed getting Team Stats: " + error);
      } finally {
        setLoading(false);
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
            <p className="text-xl text-white font-bold">
              No games found for this team. Please try reloading
            </p>
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
// TODO: Move details & match history components to seperate file
function Details({ gameList }: { gameList: Array<GameStatsProps> }) {
  const [champImages, setChampImages] = useState<Record<string, string>>({});
  useEffect(() => {
    // import all images
    const modules = import.meta.glob("../../assets/champion/*.png");
    const images: Record<string, string> = {};

    // Match champion names to images
    const loadImages = async () => {
      for (const path in modules) {
        const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
        if (name) {
          const module = (await modules[path]()) as { default: string };
          images[name] = module.default;
        }
      }
      setChampImages(images);
    };
    loadImages();
  }, []);
  // Stores all values to prevent recalculation unless the gameList var has changed
  const teamCalculations = useMemo(() => {
    const league: string = "";
    let wins: number = 0;
    const totalGames: number = gameList.length;
    let totalGameTime: number = 0;
    let averageGTMinutes: number;
    let averageGTSeconds: number;
    const roster: Array<RosterProps> = [];
    const champions: ChampionProps[] = [];

    // Adds a win to total win count per won game
    gameList.forEach((game) => {
      if (game.win) {
        wins++;
      }
      // Adds total game time from a singular player in the game since it is saved per player
      totalGameTime += game.players[0].stats.gameLength;

      game.players.forEach((player) => {
        // Adds champion object to champions array if the champion does not exist
        if (
          !champions.some(
            (champion) => champion.championName === player.stats.championName
          )
        ) {
          champions.push({
            championName: player.stats.championName,
            gamesPlayed: 1,
          });
        } else {
          // Find the champion object in the array and add 1 to gamesPlayed
          const selectedChampion = champions.find(
            (champion) => champion.championName === player.stats.championName
          );
          if (selectedChampion) {
            selectedChampion.gamesPlayed++;
          } else {
            // Should NEVER hit this error
            console.error(
              "Error: Cannot find champion even though if it does not exist it should be created...?"
            );
          }
        }
      });
    });
    // Calculate average game time
    averageGTMinutes = Math.floor(totalGameTime / gameList.length / 60);
    averageGTSeconds = Math.floor((totalGameTime / gameList.length) % 60);
    const averageGameTime: string = averageGTMinutes + ":" + averageGTSeconds;
    const winLossRatio: number = Number(((wins / totalGames) * 100).toFixed(0));

    //Add players to roster with player Id hidden
    gameList[0].players.forEach((player) => {
      roster.push({
        id: player.playerId,
        playerName: player.playerName,
      });
    });
    return { winLossRatio, averageGameTime, roster, champions };
  }, [gameList]);
  return (
    <div className="detailsSection text-white flex md:flex-row flex-col items-center p-4">
      <div className="statContainer flex md:flex-row flex-col gap-8">
        {/* Win Loss Ratio */}
        <div className="winLossRatio p-4 bg-gray">
          <p>Win/Loss {teamCalculations.winLossRatio}%</p>
        </div>
        {/* Average Game Time */}
        <div className="AvgGameTime p-4 bg-gray flex flex-col justify-center items-center">
          <p className="text-6xl">{teamCalculations.averageGameTime}</p>
          <p className="text-lg">Average Game Time </p>
        </div>

        <div className="roster flex flex-col p-4 bg-gray rounded-md">
          <div className="flex justify-center pb-4">
            <h2 className="font-bold text-xl">Roster</h2>
          </div>
          {/* Team Roster */}
          <ul className="rosterList flex flex-col gap-2">
            {teamCalculations.roster.map((player) => {
              const modifiedPlayerName = player.playerName.replace("#", " #");
              return (
                // TODO: Refactor code to allow link to work
                <Link key={player.id} to={`/stats/player/${player.playerName}`}>
                  <li className="hover:text-orange hover:transition duration-500">
                    {modifiedPlayerName}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        {/* Champions Played */}
        <div className="champsPlayed flex flex-col p-4 bg-gray rounded-md items-center md:max-w-[45%]">
          <h2 className="font-bold text-xl">Champions Played</h2>
          <div className="championContainer flex flex-wrap gap-2 p-4">
            {teamCalculations.champions.map((champion) => {
              // returns each champion image with how many times played
              return (
                <div className="champion relative w-[50px] h-[50px]">
                  <img
                    className="w-[50px] h-[50px] bg-gray"
                    src={champImages[champion.championName]}
                  ></img>
                  <div className="absolute bottom-0.5 right-0.5 bg-black px-1 leading-4">
                    {champion.gamesPlayed}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
