import { FaCrown } from "react-icons/fa";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { LuSwords } from "react-icons/lu";
import { IoLogoGameControllerA } from "react-icons/io";
import IndividualStatCard from "../cards/IndividualStatCard";

const PerformanceOverview = ({ playerData }: { playerData: PlayerOverallStats }) => {
  return (
    <div className="performanceOverview">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Performance Overview</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes grid lg:grid-cols-3 gap-4">
        {/* Win Rate */}
        <IndividualStatCard
          icon={<FaCrown className="text-white w-6.25 h-6.25 bg" />}
          iconBgColor="bg-purple bg-opacity-50"
          title="Win Rate"
          value={`${playerData.winrate.toFixed(0)}%`}
          valueColor={playerData.winrate >= 50 ? "text-blue" : "text-red"}
        />
        {/* KDA */}
        <IndividualStatCard
          icon={<LuSwords className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-red bg-opacity-50"
          title="KDA Ratio"
          value={playerData.kda.toFixed(2)}
          valueColor={
            playerData.kda >= 2 ? "text-blue" : playerData.kda <= 1 ? "text-red" : "text-white"
          }
        />
        {/* CS/Min */}
        <IndividualStatCard
          icon={<IoLogoGameControllerA className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-green bg-opacity-50"
          title="Games Played"
          value={playerData.totalGames}
        />
      </div>
    </div>
  );
};

export default PerformanceOverview;
