import IndividualStatCard from "../cards/IndividualStatCard";
import { TeamOverallStats } from "../../../types/StatTypes";
import { GiMineExplosion } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import { IoPieChart } from "react-icons/io5";
import { IoLogoGameControllerA } from "react-icons/io";

const ObjectiveControl = ({ teamData }: { teamData: TeamOverallStats | null }) => {
  if (!teamData) return null;

  const objectives = [
    {
      title: "Dragons",
      icon: <GiMineExplosion />,
      iconBgColor: "bg-red bg-opacity-50",
      avg: teamData.avgDragons,
      controlPercent: teamData.dragonControlRate,
    },
    {
      title: "Barons",
      icon: <FaCoins />, // reuse same icon for barons
      iconBgColor: "bg-orange bg-opacity-50",
      avg: teamData.avgBarons,
      controlPercent: teamData.firstBaronRate ?? 0,
    },
    {
      title: "Towers",
      icon: <IoPieChart />, // reuse existing
      iconBgColor: "bg-slate-500 bg-opacity-50",
      avg: teamData.avgTowers,
      controlPercent: teamData.firstTowerRate ?? 0,
    },
    {
      title: "Inhibitors",
      icon: <IoLogoGameControllerA />, // stand-in icon
      iconBgColor: "bg-purple bg-opacity-50",
      avg: teamData.avgInhibitors,
      controlPercent: teamData.firstInhibitorRate ?? 0,
    },
    {
      title: "Heralds",
      icon: <IoLogoGameControllerA />, // stand-in icon
      iconBgColor: "bg-cyan bg-opacity-50",
      avg: teamData.avgHeralds,
      controlPercent: 0,
    },
    {
      title: "Grubs",
      icon: <IoLogoGameControllerA />, // stand-in icon
      iconBgColor: "bg-green bg-opacity-50",
      avg: teamData.avgGrubs,
      controlPercent: teamData.voidGrubControlRate ?? 0,
    },
    {
      title: "Atahkhan",
      icon: <IoLogoGameControllerA />, // stand-in icon
      iconBgColor: "bg-yellow bg-opacity-50",
      avg: teamData.avgAtahkhan,
      controlPercent: 0,
    },
  ];

  return (
    <div className="objectiveControlGrid grid lg:grid-cols-3 gap-4 my-4">
      {objectives.map((obj) => (
        <IndividualStatCard
          key={obj.title}
          icon={obj.icon}
          iconBgColor={obj.iconBgColor}
          title={`Avg ${obj.title}`}
          value={`${Number(obj.avg).toFixed(1)} • ${Number(obj.controlPercent).toFixed(0)}%`}
        />
      ))}
    </div>
  );
};

export default ObjectiveControl;
