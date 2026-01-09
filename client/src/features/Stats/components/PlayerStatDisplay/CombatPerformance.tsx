import { FaHandshake, FaSkull } from "react-icons/fa";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { GiMineExplosion } from "react-icons/gi";
import { IoPieChart } from "react-icons/io5";
import IndividualStatCard from "../cards/IndividualStatCard";

const CombatPerformance = ({ playerData }: { playerData: PlayerOverallStats }) => {
  return (
    <div className="performanceOverview grow">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Combat</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes flex flex-col gap-4">
        {/* KP */}
        <IndividualStatCard
          icon={<FaHandshake className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-pink-500 bg-opacity-50"
          title="Kill Participation"
          value={playerData.avgKillParticipation.toFixed(0) + "%"}
          valueColor={playerData.avgKillParticipation >= 49.5 ? "text-blue" : "text-red"}
        />
        {/* Damage/Min */}
        <IndividualStatCard
          icon={<GiMineExplosion className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-cyan-500 bg-opacity-50"
          title="DMG/Min"
          value={playerData.avgDamagePerMin.toFixed(0)}
        />
        {/* Damage Share */}
        <IndividualStatCard
          icon={<IoPieChart className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-red bg-opacity-50"
          title="Damage Share"
          value={playerData.avgDamageShare.toFixed(0)+"%"}
        />
        {/* Deaths/Game */}
        <IndividualStatCard
          icon={<FaSkull className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-slate-500 bg-opacity-50"
          title="Deaths/Game"
          value={playerData.avgDeaths.toFixed(1)}
          valueColor={playerData.avgDeaths <= 4 ? "text-blue" : "text-red"}
        />
      </div>
    </div>
  );
};
export default CombatPerformance;
