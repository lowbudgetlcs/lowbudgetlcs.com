import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import getPlayerOverallStats from "../dataHandlers/getPlayerOverallStats";
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
import { useQuery } from "@tanstack/react-query";

function StatsPlayer() {
  const params = useParams();
  const navigate = useNavigate();
  const fullSummonerName = params.summonerName;

  // NavList code
  const navItems = ["Overview", "Recent Games"];
  const [activeLink, setActiveLink] = useState<string>("Overview");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  if (!fullSummonerName) {
    console.error("No summoner name provided.");
    navigate("/");
    return null;
  }

  const summonerName = fullSummonerName.split("-")[0];
  const tagLine = fullSummonerName.split("-")[1];

  const playerStatsQuery = useQuery({
    queryKey: ["playerData", summonerName, tagLine],
    queryFn: () => getPlayerOverallStats(summonerName, tagLine),
  });
  const playerGamesQuery = useQuery({
    queryKey: ["playerGames", summonerName, tagLine],
    queryFn: () => getPlayerGames(summonerName, tagLine),
  });

  const loading = playerStatsQuery.isPending || playerGamesQuery.isPending;
  const error = playerStatsQuery.error || playerGamesQuery.error;

  const playerData = playerStatsQuery.data;
  const playerGames = playerGamesQuery.data;

  if (error) {
    console.error(error);
    navigate("/");
    return null;
  }

  if (loading || !playerData || !playerGames) {
    return (
      <div className="loading min-w-64 flex items-center justify-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className="relative bg-white text-black dark:bg-black dark:text-white font-serif pt-20 max-w-[75rem] w-full mx-auto">
      <Link
        to={`/`}
        className="fixed flex z-50 my-2 px-2 rounded-lg top-1 left-16 text-2xl font-semibold cursor-pointer w-fit h-fit justify-center items-center group">
        <div className="burger cursor-pointer relative h-12 w-6 gap-1 hover:cursor-pointer self-baseline">
          <div
            className={`absolute -rotate-45 top-5 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          />
          <div
            className={`absolute rotate-45 top-7 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          />
        </div>
        <p className="group-hover:text-orange underline transition duration-300 ">Back</p>
      </Link>
      <div className="flex flex-col md:flex-row justify-stretch md:p-4 gap-4 lg:gap-8 overflow-x-hidden">
        {/* Stat Sidebar */}
        <PlayerStatSidebar summonerName={summonerName} tagLine={tagLine} playerData={playerData} />
        <div className="extendedStatsContainer flex flex-col gap-4 flex-grow px-2 py-4 md:px-4 border-2 border-gray rounded-md min-h-64">
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
                  <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Champion Stats</h2>
                  <div className="champStats flex flex-col gap-4 max-h-72 overflow-y-auto">
                    {/* Champion Box */}
                    {/* Make it autofill with information from data */}
                    {playerData.championPool
                      .slice(0, 6)
                      .sort((a, b) => b.games - a.games)
                      .map((champ) => (
                        <ChampionStatCard key={champ.championName} champ={champ} />
                      ))}
                  </div>
                </div>
              </>
            ) : activeLink === "Recent Games" ? (
              <div className="recentGames">
                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Games</h2>
                <div className="flex flex-col gap-2 items-center min-h-64">
                  {playerGames.length > 0 ? (
                    playerGames.map((game, index) => (
                      <PlayerGameCard key={index} game={game} puuid={playerData.puuid} />
                    ))
                  ) : (
                    <p className="text-xl text-white">No recent games found.</p>
                  )}
                </div>
              </div>
            ) : null}
          </>
        </div>
      </div>
    </div>
  );
}

export default StatsPlayer;
