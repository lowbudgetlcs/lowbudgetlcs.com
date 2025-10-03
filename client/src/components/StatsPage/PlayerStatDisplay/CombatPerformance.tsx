import { FaHandshake, FaSkull } from "react-icons/fa";
import IndividualStatCard from "../cards/IndividualStatCard";
import { PlayerOverallStats } from "../../../types/StatTypes";
import { LuSwords } from "react-icons/lu";
import { GiMineExplosion } from "react-icons/gi";

const CombatPerformance = ({ playerData }: { playerData: PlayerOverallStats }) => {
  return (
    <div className="performanceOverview grow">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Combat</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes flex flex-col gap-4">
        {/* KDA */}
        <IndividualStatCard
          icon={<LuSwords className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-red bg-opacity-50"
          title="KDA Ratio"
          value={playerData.kda.toFixed(2)}
          valueColor={
            playerData.kda >= 2 ? "text-blue" : playerData.kda <= 1 ? "text-red" : "text-white"
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
  );
};
export default CombatPerformance;
