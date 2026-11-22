import { FaHandshake, FaSkull } from "react-icons/fa";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { GiMineExplosion } from "react-icons/gi";
import { IoPieChart } from "react-icons/io5";
import IndividualStatCard from "../cards/IndividualStatCard";

const CombatPerformance = ({ playerData }: { playerData: PlayerOverallStats }) => {
  const teamAverage = playerData.teamAverage;

  return (
    <div className="performanceOverview grow">
      <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Combat</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* KP */}
        <IndividualStatCard
          icon={<FaHandshake className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-pink-500/70"
          title="Kill Participation"
          value={playerData.avgKillParticipation.toFixed(0) + "%"}
          valueColor={playerData.avgKillParticipation >= 49.5 ? "text-blue" : "text-red"}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgKillParticipation,
                  teamAverage: teamAverage.avgKillParticipation,
                  decimals: 0,
                  suffix: "%",
                  higherIsBetter: true,
                }
              : undefined
          }
        />
        {/* Damage/Min */}
        <IndividualStatCard
          icon={<GiMineExplosion className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-cyan-500/70"
          title="DMG/Min"
          value={playerData.avgDamagePerMin.toFixed(0)}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgDamagePerMin,
                  teamAverage: teamAverage.avgDamagePerMin,
                  decimals: 0,
                  higherIsBetter: true,
                }
              : undefined
          }
        />
        {/* Damage Share */}
        <IndividualStatCard
          icon={<IoPieChart className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-red/70"
          title="Damage Share"
          value={playerData.avgDamageShare.toFixed(0) + "%"}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgDamageShare,
                  teamAverage: teamAverage.avgDamageShare,
                  decimals: 0,
                  suffix: "%",
                }
              : undefined
          }
        />
        {/* Deaths/Game */}
        <IndividualStatCard
          icon={<FaSkull className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-slate-500/70"
          title="Deaths/Game"
          value={playerData.avgDeaths.toFixed(1)}
          valueColor={playerData.avgDeaths <= 4 ? "text-blue" : "text-red"}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgDeaths,
                  teamAverage: teamAverage.avgDeaths,
                  decimals: 1,
                  higherIsBetter: false,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};
export default CombatPerformance;
