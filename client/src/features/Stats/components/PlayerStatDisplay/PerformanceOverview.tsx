import { FaCrown } from "react-icons/fa";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { LuSwords } from "react-icons/lu";
import { IoLogoGameControllerA } from "react-icons/io";
import IndividualStatCard from "../cards/IndividualStatCard";

const PerformanceOverview = ({ playerData }: { playerData: PlayerOverallStats }) => {
  const teamAverage = playerData.teamAverage;

  return (
    <div className="performanceOverview">
      <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Performance Overview</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {/* Win Rate */}
        <IndividualStatCard
          icon={<FaCrown className="text-white w-6.25 h-6.25 bg" />}
          iconBgColor="bg-purple/70"
          title="Win Rate"
          value={`${playerData.winrate.toFixed(0)}%`}
          valueColor={playerData.winrate >= 50 ? "text-blue" : "text-red"}
          comparison={
            teamAverage
              ? { playerValue: playerData.winrate, teamAverage: teamAverage.winrate, decimals: 0, suffix: "%", higherIsBetter: true }
              : undefined
          }
        />
        {/* KDA */}
        <IndividualStatCard
          icon={<LuSwords className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-red/70"
          title="KDA Ratio"
          value={playerData.kda.toFixed(2)}
          valueColor={playerData.kda >= 2 ? "text-blue" : playerData.kda <= 1 ? "text-red" : "text-text-primary"}
          comparison={
            teamAverage
              ? { playerValue: playerData.kda, teamAverage: teamAverage.kda, decimals: 2, higherIsBetter: true }
              : undefined
          }
        />
        {/* CS/Min */}
        <IndividualStatCard
          icon={<IoLogoGameControllerA className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-cyan-500/70"
          title="Games Played"
          value={playerData.totalGames}
        />
      </div>
    </div>
  );
};

export default PerformanceOverview;
