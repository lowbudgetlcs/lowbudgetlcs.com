import { MdAttachMoney } from "react-icons/md";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { BsGraphUp } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import IndividualStatCard from "../cards/IndividualStatCard";

const EconPerformance = ({ playerData }: { playerData: PlayerOverallStats }) => {
  const teamAverage = playerData.teamAverage;

  return (
    <div className="performanceOverview grow">
      <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Economy</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Gold/Min */}
        <IndividualStatCard
          icon={<MdAttachMoney className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-yellow/70"
          title="Gold/Min"
          value={playerData.avgGoldPerMin.toFixed(0)}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgGoldPerMin,
                  teamAverage: teamAverage.avgGoldPerMin,
                  decimals: 0,
                  higherIsBetter: true,
                }
              : undefined
          }
        />
        {/* CS/Min */}
        <IndividualStatCard
          icon={<BsGraphUp className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-green/70"
          title="CS/Min"
          value={playerData.avgCsPerMin.toFixed(1)}
          valueColor={
            playerData.avgCsPerMin >= 7 ? "text-blue" : playerData.avgCsPerMin < 7 && !playerData.roles.includes("TOP") ? "text-red" : "text-text-primary"
          }
          comparison={
            teamAverage
              ? { playerValue: playerData.avgCsPerMin, teamAverage: teamAverage.avgCsPerMin, decimals: 1, higherIsBetter: true }
              : undefined
          }
        />
        {/* Gold/Game */}
        <IndividualStatCard
          icon={<GiReceiveMoney className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-yellow/70"
          title="Gold Share"
          value={playerData.avgGoldShare.toFixed(0) + "%"}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgGoldShare,
                  teamAverage: teamAverage.avgGoldShare,
                  decimals: 0,
                  suffix: "%",
                }
              : undefined
          }
        />
        {/* Vision/Game */}
        <IndividualStatCard
          icon={<IoEye className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-blue/70"
          title="Vision/Game"
          value={playerData.avgVisionScore.toFixed(1)}
          comparison={
            teamAverage
              ? {
                  playerValue: playerData.avgVisionScore,
                  teamAverage: teamAverage.avgVisionScore,
                  decimals: 1,
                  higherIsBetter: true,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default EconPerformance;
