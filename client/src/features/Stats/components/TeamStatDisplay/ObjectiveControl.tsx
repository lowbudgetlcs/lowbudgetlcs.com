import { TeamOverallStats } from "../../../../types/StatTypes";
import {
  GiChessRook,
  GiCurledTentacle,
  GiLeechingWorm,
  GiRose,
  GiSwirledShell,
} from "react-icons/gi";
import { FaDragon } from "react-icons/fa6";

const ObjectiveControl = ({ teamData }: { teamData: TeamOverallStats | null }) => {
  if (!teamData) return null;

  const objectives = [
    {
      title: "Dragon",
      icon: <FaDragon className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-red bg-opacity-50",
      avg: teamData.avgDragons,
      controlPercent: teamData.dragonControlRate,
    },

    {
      title: "Atahkhan",
      icon: <GiRose className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-linear-to-b from-red/80 to-blue/80 bg-opacity-50",
      avg: teamData.avgAtahkhan,
      controlPercent: 0,
    },
    // {
    //   title: "Inhibitor",
    //   icon: <FaGem className="text-white w-[25px] h-[25px]" />,
    //   iconBgColor: "bg-green bg-opacity-50",
    //   avg: teamData.avgInhibitors,
    //   controlPercent: teamData.firstInhibitorRate ?? 0,
    // },
    {
      title: "Tower",
      icon: <GiChessRook className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-slate-500 bg-opacity-50",
      avg: teamData.avgTowers,
      controlPercent: teamData.firstTowerRate ?? 0,
    },
    {
      title: "Grub",
      icon: <GiLeechingWorm className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-purple bg-opacity-50",
      avg: teamData.avgGrubs,
      controlPercent: teamData.voidGrubControlRate ?? 0,
    },
    {
      title: "Herald",
      icon: <GiSwirledShell className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-purple bg-opacity-50",
      avg: teamData.avgHeralds,
      controlPercent: 0,
    },

    {
      title: "Baron",
      icon: <GiCurledTentacle className="text-white w-6.25 h-6.25" />,
      iconBgColor: "bg-purple bg-opacity-50",
      avg: teamData.avgBarons,
      controlPercent: teamData.firstBaronRate ?? 0,
    },
  ];

  return (
    <div className="objectiveControlGrid grid lg:grid-cols-3 gap-4 my-4">
      {objectives.map((obj) => (
        <div
          className="flex flex-col sm:flex-row items-center px-4 border-gray border-2 bg-gray bg-opacity-20 rounded-md truncate"
          key={obj.title}>
          <div className={`${obj.iconBgColor} p-1 rounded-md`}>{obj.icon}</div>
          <div className="text flex flex-col p-2 items-center sm:items-start truncate">
            <h2 className="text-white/60 text-xl">
              {obj.title}
              {obj.title !== "Atahkhan" && "s"}
            </h2>
            <p className="text-2xl">{obj.avg.toFixed(2)}</p>
            {obj.controlPercent > 0 && (
              <p className="text-sm text-white/60">
                First {obj.title} Rate: {obj.controlPercent.toFixed(0)}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjectiveControl;
