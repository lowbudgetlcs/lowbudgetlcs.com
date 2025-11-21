import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavList from "../../NavList";
import LoadingIcon from "../../LoadingIcon";
import { useQuery } from "@tanstack/react-query";
import getTeamByName from "../dataHandlers/getTeamByName";
import getTeamGames from "../dataHandlers/getTeamGames";
import MiniGameCard from "../cards/MiniGameCard";
import IndividualStatCard from "../cards/IndividualStatCard";
import { TeamOverallStats } from "../../../types/StatTypes";
import AchievementsDisplay from "../PlayerStatDisplay/AchievementsDisplay";
import TeamStatSidebar from "./TeamStatSidebar";
import SidePerformance from "./SidePerformance";
import ObjectiveControl from "./ObjectiveControl";
import DistributionCard from "./DistributionCard";
import { FaCrown, FaCoins } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { IoLogoGameControllerA } from "react-icons/io";
import { GiMineExplosion } from "react-icons/gi";
import { IoPieChart } from "react-icons/io5";

function TeamDisplay() {
  const params = useParams();
  const navigate = useNavigate();
  const fullTeamName = params.teamName;

  // NavList code
  const navItems = ["Overview", "Recent Games"];
  const [activeLink, setActiveLink] = useState<string>("Overview");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  if (!fullTeamName) {
    console.error("No team name provided.");
    navigate("/");
    return null;
  }

  const teamName = decodeURIComponent(fullTeamName);

  const teamQuery = useQuery({
    queryKey: ["teamByName", teamName],
    queryFn: () => getTeamByName(teamName),
  });

  const teamId = teamQuery.data?.teamId;

  const teamGamesQuery = useQuery({
    queryKey: ["teamGames", teamId],
    queryFn: () => (teamId ? getTeamGames(teamId) : Promise.resolve(null)),
    enabled: !!teamId,
  });

  const loading = teamQuery.isPending || teamGamesQuery.isPending;
  const error = teamQuery.error || teamGamesQuery.error;

  const teamPayload = teamQuery.data;
  const teamData = teamPayload?.overallStats as TeamOverallStats;
  const teamLogo = teamPayload?.logo || null;
  const teamGames = teamGamesQuery.data;

  const goldDistribution = teamData?.goldDistribution || {};
  const damageDistribution = teamData?.damageDistribution || {};
  const visionDistribution = teamData?.visionDistribution || {};

  if (error) {
    console.error(error);
    navigate("/");
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
    <div className="relative bg-white text-black dark:bg-black dark:text-white font-serif pt-20 max-w-[90rem] w-full mx-auto">
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
      <div className="flex flex-col md:flex-row md:p-4 gap-4 lg:gap-8">
        <TeamStatSidebar teamName={teamName} teamData={teamData} logo={teamLogo} />
        <div className="extendedStatsContainer flex flex-col gap-4 flex-grow px-2 py-4 md:px-4 border-2 border-gray rounded-md min-h-64">
          <>
            <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
            {activeLink === "Overview" ? (
              <>
                <AchievementsDisplay />
                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Performance Overview</h2>
                <div className="smallStatBoxes grid lg:grid-cols-3 gap-4">
                  <IndividualStatCard
                    icon={<FaCrown className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-purple bg-opacity-50"
                    title="Win Rate"
                    value={`${teamData.winrate.toFixed(0)}%`}
                    valueColor={teamData.winrate >= 50 ? "text-blue" : "text-red"}
                  />
                  <IndividualStatCard
                    icon={<LuSwords className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-green bg-opacity-50"
                    title="Avg Game Length (min)"
                    value={(teamData.avgGameDuration / 60).toFixed(1)}
                  />
                  <IndividualStatCard
                    icon={<IoLogoGameControllerA className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-cyan-500 bg-opacity-50"
                    title="Games Played"
                    value={teamData.totalGames}
                  />
                </div>
                <div className="objectiveStats grid lg:grid-cols-3 gap-4 my-4">
                  <IndividualStatCard
                    icon={<GiMineExplosion className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-red bg-opacity-50"
                    title="Avg Dragons"
                    value={teamData.avgDragons.toFixed(2)}
                  />
                  <IndividualStatCard
                    icon={<FaCoins className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-orange bg-opacity-50"
                    title="Avg Barons"
                    value={teamData.avgBarons.toFixed(2)}
                  />
                  <IndividualStatCard
                    icon={<IoPieChart className="text-white w-[25px] h-[25px]" />}
                    iconBgColor="bg-slate-500 bg-opacity-50"
                    title="Avg Towers"
                    value={teamData.avgTowers.toFixed(2)}
                  />
                </div>

                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Stat Distribution</h2>
                <div className="distributionGrid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DistributionCard
                    title="Gold"
                    icon={<FaCoins />}
                    iconBgColor="bg-yellow bg-opacity-50"
                    data={goldDistribution}
                  />
                  <DistributionCard
                    title="Damage"
                    icon={<GiMineExplosion />}
                    iconBgColor="bg-red bg-opacity-50"
                    data={damageDistribution}
                  />
                  <DistributionCard
                    title="Vision"
                    icon={<IoPieChart />}
                    iconBgColor="bg-cyan bg-opacity-50"
                    data={visionDistribution}
                  />
                </div>
                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4 mt-6">Side Performance</h2>
                <SidePerformance
                  blueSidePerformance={teamData.blueSidePerformance}
                  redSidePerformance={teamData.redSidePerformance}
                />

                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4 mt-6">Objective Control</h2>
                <ObjectiveControl teamData={teamData} />
              </>
            ) : activeLink === "Recent Games" ? (
              <div className="recentGames">
                <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Games</h2>
                <div className="flex flex-col gap-2 items-center min-h-64">
                  {teamGames && teamGames.length > 0 ? (
                    teamGames.map((game, index) => <MiniGameCard key={index} game={game} />)
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

export default TeamDisplay;
