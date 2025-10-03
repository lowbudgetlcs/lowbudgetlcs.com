import topIcon from "../../../assets/laneIcons/topIcon.svg";
import middleIcon from "../../../assets/laneIcons/middleIcon.svg";
import bottomIcon from "../../../assets/laneIcons/bottomIcon.svg";
import supportIcon from "../../../assets/laneIcons/supportIcon.svg";
import jungleIcon from "../../../assets/laneIcons/jungleIcon.svg";
import { PlayerOverallStats } from "../../../types/StatTypes";

interface PlayerStatSidebarProps {
  summonerName: string;
  tagLine: string;
  playerData: PlayerOverallStats;
}

const PlayerStatSidebar = ({ summonerName, tagLine, playerData }: PlayerStatSidebarProps) => {
    return (
                <div className="statSideBar">
          <div className="flex flex-col py-8 px-4 gap-2 bg-gray/20 border-2 border-gray rounded-md flex-grow md:min-w-64 max-h-fit">
            <h1 className="text-lg text-center font-bold">
              {summonerName} <span className="text-white/60">#{tagLine}</span>
            </h1>
            {/* Rank & Role */}
            <div className="rankRole flex justify-center items-center border-b-2 p-2 border-white/45">
              {playerData.roles.map((role, index) => (
                <img
                  key={index}
                  src={
                    role === "TOP"
                      ? topIcon
                      : role === "JUNGLE"
                      ? jungleIcon
                      : role === "MIDDLE"
                      ? middleIcon
                      : role === "BOTTOM"
                      ? bottomIcon
                      : supportIcon
                  }
                  alt={role}
                  width={"30px"}
                  height={"30px"}
                />
              ))}
            </div>
            {/* Stats */}
            <ul className="quickStats flex flex-col gap-2">
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Games:</p>
                <p className="">14</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">KDA:</p>
                <p className="">1.12</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">KP/Game:</p>
                <p className="">38%</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">CS/Min:</p>
                <p className="">8.62</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Damage/Min:</p>
                <p className="">648</p>
              </li>

              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Vision/Game:</p>
                <p className="">23</p>
              </li>
            </ul>
          </div>
        </div>
    )
}

export default PlayerStatSidebar;