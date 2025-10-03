import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import getPlayerOverallStats from "../dataHandlers/getPlayerOverallStats";
import { PlayerOverallStats } from "../../../types/StatTypes";
import PlayerStatSidebar from "./PlayerStatSidebar";
import ChampionStatCard from "../cards/ChampionStatCard";
import AchievementsDisplay from "./AchievementsDisplay";
import PerformanceOverview from "./PerformanceOverview";
import CombatPerformance from "./CombatPerformance";
import EconPerformance from "./EconPerformance";

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
        // This is a placeholder for your actual data fetching function.
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
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [fullSummonerName, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
        Loading player stats...
      </div>
    );
  }

  if (error || !playerData) {
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
      <div className="flex flex-col md:flex-row justify-stretch p-4 gap-8">
        {/* Stat Sidebar */}
        <PlayerStatSidebar summonerName={summonerName} tagLine={tagLine} playerData={playerData} />
        <div className="extendedStatsContainer flex flex-col gap-8 flex-grow p-4 border-2 border-gray rounded-md">
          {/* Achievements */}
          <AchievementsDisplay />
          {/* Performance Overview */}
          <PerformanceOverview playerData={playerData} />
          <div className="performanceOverview flex flex-col sm:flex-row gap-2">
            <CombatPerformance playerData={playerData} />
            <EconPerformance playerData={playerData} />
          </div>
          {/* Favorite Champions */}
          <div className="favoriteChampions">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
              Favorite Champions
            </h2>
            <div className="favoreChampContainer flex flex-col gap-4 lg:grid grid-cols-2">
              {playerData.championPool
                .sort((a, b) => b.games - a.games)
                .slice(0, 4)
                .map((champ) => (
                  <div
                    key={champ.championName}
                    className="championContainer flex gap-2 bg-gray/20 p-2 rounded-md border-2 border-gray">
                    <img
                      src={`https://cdn.communitydragon.org/latest/champion/${champ.championName}/square`}
                      width={"50px"}
                      height={"50px"}
                      alt={champ.championName}
                      className="rounded-md"
                    />
                    <div className="champText flex justify-between items-center w-full">
                      <div>
                        <p className="font-bold">{champ.championName}</p>
                        <p className="opacity-55">{champ.games} Games</p>
                      </div>
                      <p>
                        Win Rate:
                        <span className={champ.winrate >= 50 ? "text-blue-400" : "text-red-400"}>
                          {champ.winrate.toFixed(0)}%
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Champion Stats */}
          <div className="specificChampStats">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Champion Stats</h2>
            <div className="champStats flex flex-col gap-4 lg:grid grid-cols-2">
              {/* Champion Box */}
              {/* Make it autofill with information from data */}
              {playerData.championPool
                .sort((a, b) => b.games - a.games)
                .map((champ) => (
                  <ChampionStatCard champ={champ} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPlayer;
