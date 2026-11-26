import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavList from "../../../../layout/NavList";
import LoadingIcon from "../../../../components/LoadingIcon";
import { TeamOverallStats } from "../../../../types/StatTypes";
import TeamAchievementsDisplay from "./TeamAchievementsDisplay";
import TeamStatSidebar from "./TeamStatSidebar";
import TeamChampionPool from "./TeamChampionPool";
import SidePerformance from "./SidePerformance";
import ObjectiveControl from "./ObjectiveControl";
import DistributionCard from "./DistributionCard";
import StatsTrendChart from "../StatsTrendChart";
import { FaCrown, FaCoins } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { IoLogoGameControllerA } from "react-icons/io";
import { GiMineExplosion } from "react-icons/gi";
import { IoEye, IoPieChart } from "react-icons/io5";
import IndividualStatCard from "../cards/IndividualStatCard";
import useTeamByNameQuery from "../../api/queries/useTeamByNameQuery";
import useTeamSeasonsQuery from "../../api/queries/useTeamSeasonsQuery";
import useTeamStatsByIdQuery from "../../api/queries/useTeamStatsByIdQuery";
import useTeamGamesQuery from "../../api/queries/useTeamGamesQuery";
import TeamSeriesList from "./TeamSeriesList";

function TeamDisplay() {
  const params = useParams();
  const navigate = useNavigate();
  const fullTeamName = params.teamName;

  // NavList code
  const navItems = ["Overview", "Recent Games", "Champion Pool"];
  const [activeLink, setActiveLink] = useState<string>("Overview");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  if (!fullTeamName) {
    console.error("No team name provided.");
    navigate("/stats");
    return null;
  }

  const teamName = fullTeamName;

  const teamQuery = useTeamByNameQuery(teamName);

  const seasonsQuery = useTeamSeasonsQuery(teamName);

  const activeTeamId = selectedTeamId ?? teamQuery.data?.teamId;
  const shouldFetchStatsById = selectedTeamId !== null && selectedTeamId !== teamQuery.data?.teamId;

  const statsByIdQuery = useTeamStatsByIdQuery(selectedTeamId ?? 0, {
    enabled: !!shouldFetchStatsById,
  });

  const teamGamesQuery = useTeamGamesQuery(activeTeamId ?? 0, {
    enabled: !!activeTeamId && activeLink === "Recent Games",
  });

  const loading = teamQuery.isPending || seasonsQuery.isPending || (shouldFetchStatsById && statsByIdQuery.isPending);
  const error = teamQuery.error || seasonsQuery.error || statsByIdQuery.error;

  const teamPayload = teamQuery.data;
  const teamData = shouldFetchStatsById ? statsByIdQuery.data : (teamPayload?.overallStats as TeamOverallStats);
  const teamLogo = teamPayload?.logo ?? null;
  const teamGames = teamGamesQuery.data;

  const goldDistribution = teamData?.goldDistribution ?? {};
  const damageDistribution = teamData?.damageDistribution ?? {};
  const visionDistribution = teamData?.visionDistribution ?? {};

  if (error) {
    console.error(error);
    navigate("/stats");
    return null;
  }

  if (loading || !teamData) {
    return (
      <div className="loading min-w-64 flex items-center justify-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  const teamTrends = teamData.gameTrends ?? [];
  const trendLabels = teamTrends.map((game) => `G${game.gameNumber} ${game.win ? "W" : "L"}`);

  return (
    <div className="relative bg-bg-dark text-text-primary font-serif pt-14 max-w-360 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:p-4 gap-4 lg:gap-8">
        <TeamStatSidebar
          teamName={teamName}
          teamData={teamData}
          logo={teamLogo}
          seasons={seasonsQuery.data}
          selectedTeamId={activeTeamId}
          onSeasonChange={setSelectedTeamId}
        />
        <div className="extendedStatsContainer flex min-w-0 grow flex-col gap-5 px-3 py-4 md:px-5 border border-border bg-bg rounded-xl min-h-64">
          <>
            <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
            {activeLink === "Overview" ? (
              <>
                <TeamAchievementsDisplay teamData={teamData} />
                <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Performance Overview</h2>
                <div className="smallStatBoxes grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <IndividualStatCard
                    icon={<FaCrown className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-purple/70"
                    title="Win Rate"
                    value={`${teamData.winrate.toFixed(0)}%`}
                    valueColor={teamData.winrate >= 50 ? "text-blue" : "text-red"}
                  />
                  <IndividualStatCard
                    icon={<LuSwords className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-green/70"
                    title="Avg Game Length (min)"
                    value={(teamData.avgGameDuration / 60).toFixed(1)}
                  />
                  <IndividualStatCard
                    icon={<IoLogoGameControllerA className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-cyan-500/70"
                    title="Games Played"
                    value={teamData.totalGames}
                  />
                </div>
                <div className="objectiveStats grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 my-4">
                  <IndividualStatCard
                    icon={<GiMineExplosion className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-red/70"
                    title="Avg Dragons"
                    value={teamData.avgDragons.toFixed(2)}
                  />
                  <IndividualStatCard
                    icon={<FaCoins className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-orange/70"
                    title="Avg Barons"
                    value={teamData.avgBarons.toFixed(2)}
                  />
                  <IndividualStatCard
                    icon={<IoPieChart className="text-white w-6.25 h-6.25" />}
                    iconBgColor="bg-slate-500/70"
                    title="Avg Towers"
                    value={teamData.avgTowers.toFixed(2)}
                  />
                </div>

                <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Stat Distribution</h2>
                <div className="distributionGrid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <DistributionCard title="Gold" icon={<FaCoins />} iconBgColor="bg-yellow/70" data={goldDistribution} />
                  <DistributionCard title="Damage" icon={<GiMineExplosion />} iconBgColor="bg-red/70" data={damageDistribution} />
                  <DistributionCard title="Vision" icon={<IoEye />} iconBgColor="bg-cyan-500/70" data={visionDistribution} />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="grow">
                    <h2 className="text-2xl font-bold border-b-2 border-border mb-4 mt-6">Side Performance</h2>
                    <SidePerformance blueSidePerformance={teamData.blueSidePerformance} redSidePerformance={teamData.redSidePerformance} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold border-b-2 border-border mb-4 mt-6">Objective Control</h2>
                <ObjectiveControl teamData={teamData} />
                <section className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold border-b-2 border-border pb-2">Match Trends</h2>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <StatsTrendChart
                      title="Team economy and damage"
                      labels={trendLabels}
                      series={[
                        {
                          label: "Gold/min",
                          values: teamTrends.map((game) => game.goldPerMin),
                          color: "#facc15",
                          decimals: 0,
                          unit: "gold/min",
                        },
                        {
                          label: "Damage/min",
                          values: teamTrends.map((game) => game.damagePerMin),
                          color: "#f87171",
                          decimals: 0,
                          unit: "damage/min",
                          axis: "y1",
                        },
                      ]}
                    />
                    <StatsTrendChart
                      title="Objectives per game"
                      labels={trendLabels}
                      series={[
                        {
                          label: "Dragons",
                          values: teamTrends.map((game) => game.dragons),
                          color: "#f87171",
                          decimals: 0,
                          unit: "objectives",
                        },
                        {
                          label: "Barons",
                          values: teamTrends.map((game) => game.barons),
                          color: "#a78bfa",
                          decimals: 0,
                          unit: "objectives",
                        },
                        {
                          label: "Towers",
                          values: teamTrends.map((game) => game.towers),
                          color: "#94a3b8",
                          decimals: 0,
                          unit: "objectives",
                        },
                      ]}
                    />
                  </div>
                </section>
              </>
            ) : activeLink === "Champion Pool" ? (
              <TeamChampionPool teamData={teamData} />
            ) : activeLink === "Recent Games" ? (
              <div className="recentGames">
                <div className="border-b-2 border-border mb-4">
                  <h2 className="text-2xl font-bold">Series &amp; Games</h2>
                  <p className="text-text-secondary">Games played: {teamData?.totalGames}</p>
                  <p className="text-text-secondary">Game wins: {teamData?.wins}</p>
                  <p className="text-text-secondary">Game losses: {teamData?.losses}</p>
                </div>

                <div className="flex flex-col gap-2 items-center min-h-64">
                  {teamGamesQuery.isPending ? (
                    <LoadingIcon />
                  ) : teamGamesQuery.error ? (
                    <p className="text-center text-red">Failed to load games. Please try again later.</p>
                  ) : teamGames?.length && activeTeamId ? (
                    <TeamSeriesList
                      games={teamGames}
                      teamId={activeTeamId}
                      teamName={fullTeamName}
                      seriesMetadataAvailable={teamGames[0].seriesMetadataAvailable}
                    />
                  ) : (
                    <p className="text-xl text-text-primary">No recent series found.</p>
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

export default TeamDisplay;
