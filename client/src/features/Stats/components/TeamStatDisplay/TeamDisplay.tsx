import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavList from "../../../../layout/NavList";
import LoadingIcon from "../../../../components/LoadingIcon";
import { TeamOverallStats } from "../../../../types/StatTypes";
import TeamAchievementsDisplay from "./TeamAchievementsDisplay";
import TeamStatSidebar from "./TeamStatSidebar";
import SidePerformance from "./SidePerformance";
import ObjectiveControl from "./ObjectiveControl";
import DistributionCard from "./DistributionCard";
import { FaCrown, FaCoins } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { IoLogoGameControllerA } from "react-icons/io";
import { GiMineExplosion } from "react-icons/gi";
import { IoEye, IoPieChart } from "react-icons/io5";
import IndividualStatCard from "../cards/IndividualStatCard";
import MiniGameCard from "../cards/MiniGameCard";
import useTeamByNameQuery from "../../api/queries/useTeamByNameQuery";
import useTeamSeasonsQuery from "../../api/queries/useTeamSeasonsQuery";
import useTeamStatsByIdQuery from "../../api/queries/useTeamStatsByIdQuery";
import useTeamGamesQuery from "../../api/queries/useTeamGamesQuery";

function TeamDisplay() {
  const params = useParams();
  const navigate = useNavigate();
  const fullTeamName = params.teamName;

  // NavList code
  const navItems = ["Overview", "Recent Games"];
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

  const teamName = decodeURIComponent(fullTeamName);

  const teamQuery = useTeamByNameQuery(teamName);

  const seasonsQuery = useTeamSeasonsQuery(teamName);

  const activeTeamId = selectedTeamId ?? teamQuery.data?.teamId;
  const shouldFetchStatsById = selectedTeamId !== null && selectedTeamId !== teamQuery.data?.teamId;

  const statsByIdQuery = useTeamStatsByIdQuery(selectedTeamId ?? 0, {
    enabled: !!shouldFetchStatsById,
  });

  const teamGamesQuery = useTeamGamesQuery(activeTeamId ?? 0, {
    enabled: !!activeTeamId,
  });

  const loading = teamQuery.isPending || teamGamesQuery.isPending || seasonsQuery.isPending || (shouldFetchStatsById && statsByIdQuery.isPending);
  const error = teamQuery.error || teamGamesQuery.error || seasonsQuery.error || statsByIdQuery.error;

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
        <div className="extendedStatsContainer flex flex-col gap-4 grow px-2 py-4 md:px-4 border border-border bg-bg rounded-xl min-h-64">
          <>
            <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
            {activeLink === "Overview" ? (
              <>
                <TeamAchievementsDisplay teamData={teamData} />
                <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Performance Overview</h2>
                <div className="smallStatBoxes grid lg:grid-cols-3 gap-4">
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
                <div className="objectiveStats grid lg:grid-cols-3 gap-4 my-4">
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
                <div className="distributionGrid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </>
            ) : activeLink === "Recent Games" ? (
              <div className="recentGames">
                <div className="border-b-2 border-border mb-4">
                  <h2 className="text-2xl font-bold">Games - {teamData?.totalGames}</h2>
                  <p className="text-text-secondary">Wins: {teamData?.wins}</p>
                  <p className="text-text-secondary">Losses: {teamData?.losses}</p>
                </div>

                <div className="flex flex-col gap-2 items-center min-h-64">
                  {teamGames && teamGames.length > 0 ? (
                    teamGames.map((game, index) => <MiniGameCard key={index} game={game} teamName={fullTeamName} />)
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

export default TeamDisplay;
