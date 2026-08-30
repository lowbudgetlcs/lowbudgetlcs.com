import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerStatSidebar from "./PlayerStatSidebar";
import AchievementsDisplay from "./AchievementsDisplay";
import PerformanceOverview from "./PerformanceOverview";
import CombatPerformance from "./CombatPerformance";
import EconPerformance from "./EconPerformance";
import NavList from "../../../../layout/NavList";
import LoadingIcon from "../../../../components/LoadingIcon";
import ChampionTopImage from "./ChampionTopImage";
import ChampionStatCard from "../cards/ChampionStatCard";
import PlayerGameCard from "../cards/PlayerGameCard";
import usePlayerOverallStatsQuery from "../../api/queries/usePlayerOverallStatsQuery";
import usePlayerGamesQuery from "../../api/queries/usePlayerGamesQuery";
import usePlayerSeasonsQuery from "../../api/queries/usePlayerSeasonsQuery";

function StatsPlayer() {
  const params = useParams();
  const navigate = useNavigate();
  const fullSummonerName = params.summonerName;

  // NavList code
  const navItems = ["Overview", "Recent Games"];
  const [activeLink, setActiveLink] = useState<string>("Overview");
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  if (!fullSummonerName) {
    console.error("No summoner name provided.");
    navigate("/stats");
    return null;
  }

  const summonerName = fullSummonerName.split("-")[0];
  const tagLine = fullSummonerName.split("-")[1];

  const playerStatsQuery = usePlayerOverallStatsQuery(summonerName, tagLine, selectedSeasonId ?? undefined);
  const playerGamesQuery = usePlayerGamesQuery(summonerName, tagLine, selectedSeasonId ?? undefined);

  const seasonsQuery = usePlayerSeasonsQuery(playerStatsQuery.data?.puuid ?? "", {
    enabled: !!playerStatsQuery.data?.puuid,
  });

  useEffect(() => {
    if (selectedSeasonId === null && seasonsQuery.data?.[0]) {
      setSelectedSeasonId(seasonsQuery.data[0].seasonId);
    }
  }, [selectedSeasonId, seasonsQuery.data]);

  const awaitingInitialSeason = selectedSeasonId === null && (seasonsQuery.data?.length ?? 0) > 0;
  const loading =
    playerStatsQuery.isPending ||
    playerGamesQuery.isPending ||
    (seasonsQuery.isPending && !!playerStatsQuery.data?.puuid) ||
    awaitingInitialSeason;
  const error = playerStatsQuery.error || playerGamesQuery.error;

  const playerData = playerStatsQuery.data;
  const playerGames = playerGamesQuery.data;

  if (error) {
    console.error(error);
    navigate("/stats");
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
    <div className="relative bg-bg-dark text-text-primary font-serif pt-14 max-w-360 w-full mx-auto">
      <div className="relative flex flex-col md:flex-row md:p-4 gap-4 lg:gap-8">
        {/* Top Champion Image */}
        <ChampionTopImage playerData={playerData} />
        {/* Stat Sidebar */}
        <PlayerStatSidebar
          summonerName={summonerName}
          tagLine={tagLine}
          playerData={playerData}
          seasons={seasonsQuery.data}
          selectedSeasonId={selectedSeasonId}
          onSeasonChange={setSelectedSeasonId}
        />
        {/* Extended Stats */}
        <div className="extendedStatsContainer flex flex-col gap-4 grow md:mt-48 px-2 py-4 md:px-4 border border-border bg-bg rounded-xl min-h-64 z-10">
          <>
            {/* Achievements */}
            <AchievementsDisplay playerData={playerData} />
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
                  <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Champion Stats</h2>
                  <div className="champStats grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto">
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
                <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Games</h2>
                <div className="flex flex-col gap-2 items-center min-h-64">
                  {playerGames.length > 0 ? (
                    playerGames.map((game, index) => <PlayerGameCard key={index} game={game} puuid={playerData.puuid} />)
                  ) : (
                    <p className="text-xl text-text-primary">No recent games found.</p>
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
