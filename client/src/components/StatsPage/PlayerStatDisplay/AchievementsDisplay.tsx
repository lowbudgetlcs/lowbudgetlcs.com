import { FaCrown, FaSkull } from "react-icons/fa";
import { FaWheatAwn } from "react-icons/fa6";
import { GiCoffin } from "react-icons/gi";
import { IoEye } from "react-icons/io5";
import { PiCampfireFill } from "react-icons/pi";

const AchievementsDisplay = () => {
  return (
    <div className="achievements">
      <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">Achievements</h2>
      <div className="achievementContainer flex flex-col sm:flex-row flex-wrap gap-4 text-white/95 items-center md:items-start">
        <div className="achievement flex gap-2 border-2 border-green bg-green/40 items-center px-2 py-1 rounded-md">
          <FaWheatAwn></FaWheatAwn>
          <p>Great Farmer</p>
        </div>
        <div className="achievement flex gap-2 border-2 border-red bg-red/40 items-center px-2 py-1 rounded-md">
          <FaSkull></FaSkull>
          <p>Blood Thirsty</p>
        </div>
        <div className="achievement flex gap-2 border-2 border-green bg-green/40 items-center px-2 py-1 rounded-md">
          <PiCampfireFill></PiCampfireFill>
          <p>Survivor</p>
        </div>
        <div className="achievement flex gap-2 border-2 border-white/60 bg-gray/40 items-center px-2 py-1 rounded-md">
          <GiCoffin></GiCoffin>
          <p>Gray Screen Enthusiast</p>
        </div>
        <div className="achievement flex gap-2 border-2 border-purple bg-purple/40 items-center px-2 py-1 rounded-md">
          <IoEye></IoEye>
          <p>All-Seeing Eye</p>
        </div>
        <div className="achievement flex gap-2 border-2 border-yellow bg-yellow/40 items-center px-2 py-1 rounded-md">
          <FaCrown></FaCrown>
          <p>S13 Champion</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementsDisplay;
