import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuSwords } from "react-icons/lu";
import { IoEye } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { GiMineExplosion } from "react-icons/gi";
import { FaCrown, FaHandshake, FaSkull } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import getPlayerOverallStats from "../dataHandlers/getPlayerOverallStats";
import { PlayerOverallStats } from "../../../types/StatTypes";
import IndividualStatCard from "../cards/IndividualStatCard";
import PlayerStatSidebar from "./PlayerStatSidebar";
import ChampionStatCard from "../cards/ChampionStatCard";
import AchievementsDisplay from "./AchievementsDisplay";
import CombatPerformance from "./CombatPerformance";

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
    <div className="relative bg-white text-black dark:bg-black dark:text-white font-serif pt-20">
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
          <div className="performanceOverview flex flex-col md:flex-row gap-2">
            <CombatPerformance playerData={playerData}/>
            <div className="performanceOverview">
              <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
                Performance Overview
              </h2>
              {/* Stat Boxes */}
              <div className="smallStatBoxes flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Win Rate */}
                <IndividualStatCard
                  icon={<FaCrown className="text-white w-[25px] h-[25px] bg" />}
                  iconBgColor="bg-purple bg-opacity-50"
                  title="Win Rate"
                  value={`${playerData.winrate.toFixed(0)}%`}
                  valueColor={playerData.winrate >= 50 ? "text-blue" : "text-red"}
                />
                {/* KDA */}
                <IndividualStatCard
                  icon={<LuSwords className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-red bg-opacity-50"
                  title="KDA Ratio"
                  value={playerData.kda.toFixed(2)}
                  valueColor={
                    playerData.kda >= 2
                      ? "text-blue"
                      : playerData.kda <= 1
                      ? "text-red"
                      : "text-white"
                  }
                />
                {/* Damage/Min */}
                <IndividualStatCard
                  icon={<GiMineExplosion className="text-white w-[25px] h-[25px] bg-" />}
                  iconBgColor="bg-cyan-500 bg-opacity-50"
                  title="DMG/Min"
                  value={playerData.avgDamagePerMin.toFixed(0)}
                />
                {/* KP */}
                <IndividualStatCard
                  icon={<FaHandshake className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-pink-500 bg-opacity-50"
                  title="Kill Participation"
                  value={playerData.avgKillParticipation.toFixed(0) + "%"}
                  valueColor={playerData.avgKillParticipation >= 49.5 ? "text-blue" : "text-red"}
                />
                {/* Gold/Min */}
                <IndividualStatCard
                  icon={<MdAttachMoney className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-yellow bg-opacity-50"
                  title="Gold/Min"
                  value={playerData.avgGoldPerMin.toFixed(0)}
                />
                {/* CS/Min */}
                <IndividualStatCard
                  icon={<BsGraphUp className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-green bg-opacity-50"
                  title="CS/Min"
                  value={playerData.avgCsPerMin.toFixed(1)}
                />
                {/* Vision/Game */}
                <IndividualStatCard
                  icon={<IoEye className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-blue bg-opacity-50"
                  title="Vision/Game"
                  value={playerData.avgVisionScore.toFixed(1)}
                />
                {/* Deaths/Game */}
                <IndividualStatCard
                  icon={<FaSkull className="text-white w-[25px] h-[25px]" />}
                  iconBgColor="bg-slate-500 bg-opacity-50"
                  title="Deaths/Game"
                  value={playerData.avgDeaths.toFixed(1)}
                  valueColor={playerData.avgDeaths <= 4 ? "text-blue" : "text-red"}
                />
              </div>
            </div>
          </div>
          "{/* Favorite Champions */}
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
