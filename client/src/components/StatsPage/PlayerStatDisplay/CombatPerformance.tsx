import { FaCrown, FaHandshake, FaSkull } from "react-icons/fa";
import { PlayerOverallStats } from "../../../types/StatTypes";
import IndividualStatCard from "../cards/IndividualStatCard";
import { LuSwords } from "react-icons/lu";
import { GiMineExplosion } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { IoEye } from "react-icons/io5";

const CombatPerformance = ({playerData}: {playerData: PlayerOverallStats}) => {
  return (
    <div className="performanceOverview">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Performance Overview</h2>
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
  );
};

export default CombatPerformance;