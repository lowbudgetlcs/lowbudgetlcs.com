import { FaCrown, FaSkull } from "react-icons/fa";
import { FaWheatAwn } from "react-icons/fa6";
import { GiCoffin } from "react-icons/gi";
import { IoEye } from "react-icons/io5";
import { PiCampfireFill } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import getAchievements from "../../api/getAchievements";
import commonAchievements from "../../data/commonAchievements.json";
import { PlayerOverallStats, TeamOverallStats } from "../../../../types/StatTypes";

interface AchievementsDisplayProps {
  playerData?: PlayerOverallStats;
  teamData?: TeamOverallStats;
}

const iconMap: { [key: string]: React.ElementType } = {
  FaWheatAwn: FaWheatAwn,
  FaSkull: FaSkull,
  GiCoffin: GiCoffin,
  IoEye: IoEye,
  PiCampfireFill: PiCampfireFill,
  FaCrown: FaCrown,
};

const AchievementsDisplay = ({ playerData }: AchievementsDisplayProps) => {
  const { data: customAchievementsDef } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  const customAchievementsIds = playerData?.customAchievements || [];

  const displayedCustomAchievements = customAchievementsDef
    ? customAchievementsDef.filter((ach) => customAchievementsIds.includes(ach.id))
    : [];

  const displayedCommonAchievements = playerData
    ? commonAchievements.filter((ach) => {
        if (ach.name === "Great Farmer") return playerData.avgCsPerMin > 7;
        if (ach.name === "Blood Thirsty") return playerData.avgKillParticipation > 50;
        if (ach.name === "Survivor") return playerData.avgDeaths < 5;
        if (ach.name === "Gray Screen Enthusiast") return playerData.avgDeaths > 7;
        if (ach.name === "All-Seeing Eye") return playerData.avgVisionScore > 60;
        return false;
      })
    : [];

  if (displayedCustomAchievements.length === 0 && displayedCommonAchievements.length === 0) {
    return null;
  }

  return (
    <div className="achievements">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Achievements</h2>
      <div className="achievementContainer flex flex-col sm:flex-row flex-wrap gap-4 text-white/95 items-center md:items-start">
        {/* Custom Achievements */}
        {displayedCustomAchievements.map((ach) => {
          const IconComponent = iconMap[ach.icon] || FaCrown;
          return (
            <div
              key={`custom-${ach.id}`}
              className={`achievement group relative flex gap-2 border-2 border-${ach.color} bg-${ach.color} bg-opacity-40 items-center px-2 py-1 rounded-md cursor-context-menu select-none`}
            >
              <IconComponent />
              <p>{ach.name}</p>
              <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-50 bg-gray text-white text-xs px-2 py-1 rounded-sm z-50 animate-fadeIn text-center pointer-events-none">
                {ach.description}
              </div>
            </div>
          );
        })}

        {/* Common Achievements */}
        {displayedCommonAchievements.map((ach, index) => {
          const IconComponent = iconMap[ach.icon];
          return (
            <div
              key={`common-${index}`}
              className={`achievement group relative flex gap-2 border-2 border-${ach.color} bg-${ach.color} bg-opacity-40 items-center px-2 py-1 rounded-md cursor-context-menu select-none`}
            >
              {IconComponent && <IconComponent />}
              <p>{ach.name}</p>
              <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-37.5 bg-gray text-white text-xs px-2 py-1 rounded-sm z-50 animate-fadeIn-300ms text-center pointer-events-none">
                {ach.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsDisplay;
