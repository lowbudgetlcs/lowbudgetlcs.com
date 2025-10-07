import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import getPlayerOverallStats from "../dataHandlers/getPlayerOverallStats";
import { PlayerOverallStats, RecentGame } from "../../../types/StatTypes";
import PlayerStatSidebar from "./PlayerStatSidebar";
import ChampionStatCard from "../cards/ChampionStatCard";
import AchievementsDisplay from "./AchievementsDisplay";
import PerformanceOverview from "./PerformanceOverview";
import CombatPerformance from "./CombatPerformance";
import EconPerformance from "./EconPerformance";
import NavList from "../../NavList";
import getPlayerGames from "../dataHandlers/getPlayerGames";
import PlayerGameCard from "../cards/PlayerGameCard";
import LoadingIcon from "../../LoadingIcon";

function StatsPlayer() {
  const params = useParams();
  const navigate = useNavigate();
  const fullSummonerName = params.summonerName;
  if (!fullSummonerName) {
    navigate("/");
    return null;
  }
  const summonerName = fullSummonerName.split("-")[0];
  const tagLine = fullSummonerName.split("-")[1];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerOverallStats | null>(null);
  const [playerGames, setPlayerGames] = useState<RecentGame[]>([]);

  const [activeLink, setActiveLink] = useState<string>("Overview");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  const navItems = ["Overview", "Recent Games"];
  useEffect(() => {
    if (!fullSummonerName) {
      navigate("/");
      return;
    }
    const [summonerName, tagLine] = fullSummonerName.split("-");

    const fetchPlayerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPlayerOverallStats(summonerName, tagLine);
        if (!response) {
          setError("Player data not found.");
          return;
        }
        setPlayerData(response);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching player data:", err);
      } finally {
        if (playerGames.length > 0) {
          setLoading(false);
        }
      }
    };

    fetchPlayerData();
  }, [fullSummonerName, navigate, summonerName, tagLine]);

  useEffect(() => {
    if (!playerData) return;
    const fetchPlayerMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPlayerGames(summonerName, tagLine);
        if (!response) {
          setError("Player data not found.");
          return;
        }
        setPlayerGames(response);
      } catch (err: any) {
        console.error("Error fetching player matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerMatches();
  }, [playerData, summonerName, tagLine]);

  if (error) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative bg-white text-black dark:bg-black dark:text-white font-serif pt-20 max-w-[90rem]">
      <Link
        to={`/`}
        className="fixed flex z-50 my-2 px-2 rounded-lg top-1 left-16 text-2xl font-semibold cursor-pointer w-fit h-fit justify-center items-center  group">
        <div className="burger cursor-pointer relative h-12 w-6 gap-1 hover:cursor-pointer self-baseline">
          <div
            className={`absolute -rotate-45 top-5 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}></div>
          <div
            className={`absolute rotate-45 top-7 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}></div>
        </div>
        <p className="group-hover:text-orange underline transition duration-300 ">Back</p>
      </Link>
      <div className="flex flex-col md:flex-row justify-stretch md:p-4 gap-8">
        {/* Stat Sidebar */}
        <PlayerStatSidebar summonerName={summonerName} tagLine={tagLine} playerData={playerData} />
        <div className="extendedStatsContainer flex flex-col gap-4 flex-grow p-4 border-2 border-gray rounded-md min-h-64">
          {!playerData || loading ? (
            <div className="loading min-w-64 flex items-center justify-center">
              <LoadingIcon />
            </div>
          ) : (
            <>
              {/* Achievements */}
              <AchievementsDisplay />
              {/* Performance Overview */}
              <PerformanceOverview playerData={playerData} />
              <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
              {activeLink === "Overview" ? (
                <>
                  <div className="performanceOverview flex flex-col sm:flex-row gap-2">
                    <CombatPerformance playerData={playerData} />
                    <EconPerformance playerData={playerData} />
                  </div>
                  {/* Champion Stats */}
                  <div className="specificChampStats">
                    <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
                      Champion Stats
                    </h2>
                    <div className="champStats flex flex-col gap-4 max-h-72 overflow-y-auto">
                      {/* Champion Box */}
                      {/* Make it autofill with information from data */}
                      {playerData.championPool
                        .slice(0, 6)
                        .sort((a, b) => b.games - a.games)
                        .map((champ) => (
                          <ChampionStatCard champ={champ} />
                        ))}
                    </div>
                  </div>
                </>
              ) : activeLink === "Recent Games" ? (
                <div className="recentGames">
                  <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Games</h2>
                  <div className="flex flex-col gap-2 items-center min-h-64">
                    {playerGames.length > 0 ? (
                      playerGames.map((game, index) => <PlayerGameCard key={index} game={game} />)
                    ) : (
                      <p className="text-xl text-white">No recent games found.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPlayer;
