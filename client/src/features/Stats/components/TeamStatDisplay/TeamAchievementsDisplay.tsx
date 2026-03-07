import { FaCrown, FaSkull } from "react-icons/fa";
import { FaWheatAwn } from "react-icons/fa6";
import { GiCoffin } from "react-icons/gi";
import { IoEye } from "react-icons/io5";
import { PiCampfireFill } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import getAchievements from "../../api/getAchievements";
import { TeamOverallStats } from "../../../../types/StatTypes";

interface TeamAchievementsDisplayProps {
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

const achievementColorClasses: Record<string, string> = {
  green: "border-green bg-green/40",
  red: "border-red bg-red/40",
  gray: "border-gray bg-gray/40",
  purple: "border-purple bg-purple/40",
  blue: "border-blue bg-blue/40",
  orange: "border-orange bg-orange/40",
  yellow: "border-yellow bg-yellow/40",
};

const TeamAchievementsDisplay = ({ teamData }: TeamAchievementsDisplayProps) => {
  const { data: customAchievementsDef } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  const customAchievementsIds = teamData?.customAchievements || [];

  const displayedCustomAchievements = customAchievementsDef
    ? customAchievementsDef.filter((ach) => customAchievementsIds.includes(ach.id))
    : [];

  if (displayedCustomAchievements.length === 0) {
    return null;
  }

  return (
    <div className="achievements">
      <h2 className="text-2xl font-bold border-b-2 border-border mb-4">Achievements</h2>
      <div className="achievementContainer flex flex-col sm:flex-row flex-wrap gap-4 text-text-primary items-center md:items-start">
        {/* Custom Achievements */}
        {displayedCustomAchievements.map((ach) => {
          const IconComponent = iconMap[ach.icon] || FaCrown;
          return (
            <div
              key={`custom-${ach.id}`}
              className={`achievement flex gap-2 border-2 items-center px-2 py-1 rounded-md ${achievementColorClasses[ach.color] ?? "border-border bg-border/40"}`}
              title={ach.description}>
              <IconComponent />
              <p>{ach.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamAchievementsDisplay;
