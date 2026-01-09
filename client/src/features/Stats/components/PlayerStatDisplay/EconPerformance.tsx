import { MdAttachMoney } from "react-icons/md";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import { BsGraphUp } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import IndividualStatCard from "../cards/IndividualStatCard";

const EconPerformance = ({ playerData }: { playerData: PlayerOverallStats }) => {
  return (
    <div className="performanceOverview grow">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Economy</h2>
      {/* Stat Boxes */}
      <div className="smallStatBoxes flex flex-col gap-4">
        {/* Gold/Min */}
        <IndividualStatCard
          icon={<MdAttachMoney className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-yellow bg-opacity-50"
          title="Gold/Min"
          value={playerData.avgGoldPerMin.toFixed(0)}
        />
        {/* CS/Min */}
        <IndividualStatCard
          icon={<BsGraphUp className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-green bg-opacity-50"
          title="CS/Min"
          value={playerData.avgCsPerMin.toFixed(1)}
          valueColor={playerData.avgCsPerMin >= 7 ? "text-blue" : (playerData.avgCsPerMin < 7 && !playerData.roles.includes("TOP"))? "text-red" : "text-white"}
        />
        {/* Gold/Game */}
        <IndividualStatCard
          icon={<GiReceiveMoney className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-yellow bg-opacity-50"
          title="Gold Share"
          value={playerData.avgGoldShare.toFixed(0) + "%"}
        />
        {/* Vision/Game */}
        <IndividualStatCard
          icon={<IoEye className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-blue bg-opacity-50"
          title="Vision/Game"
          value={playerData.avgVisionScore.toFixed(1)}
        />
      </div>
    </div>
  );
};

export default EconPerformance;
