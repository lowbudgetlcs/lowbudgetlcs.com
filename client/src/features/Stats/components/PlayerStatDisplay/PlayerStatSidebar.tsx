import topIcon from "../../../../assets/laneIcons/topIcon.svg";
import middleIcon from "../../../../assets/laneIcons/middleIcon.svg";
import bottomIcon from "../../../../assets/laneIcons/bottomIcon.svg";
import supportIcon from "../../../../assets/laneIcons/supportIcon.svg";
import jungleIcon from "../../../../assets/laneIcons/jungleIcon.svg";
import { PlayerOverallStats } from "../../../../types/StatTypes";
import LoadingIcon from "../../../../components/LoadingIcon";
import { Link } from "react-router-dom";
import { PlayerSeason } from "../../api/getPlayerSeasons";

interface PlayerStatSidebarProps {
  summonerName: string;
  tagLine: string;
  playerData: PlayerOverallStats | null;
  seasons?: PlayerSeason[];
  selectedSeasonId?: number | null;
  onSeasonChange?: (seasonId: number) => void;
}

const PlayerStatSidebar = ({
  summonerName,
  tagLine,
  playerData,
  seasons,
  selectedSeasonId,
  onSeasonChange,
}: PlayerStatSidebarProps) => {
  return (
    <div className="statSideBar sticky w-full md:w-64 shrink-0 mb-4 md:mb-0 left-0 md:top-24 self-start">
      <div className="flex flex-col py-8 px-4 gap-2 bg-black border-2 border-gray rounded-md grow md:min-w-64">
        <h1 className="text-lg text-center font-bold">
          {summonerName} <span className="text-white/60">#{tagLine}</span>
        </h1>

        {/* Rank & Role */}
        <div className="rankRole flex justify-center items-center ">
          {playerData ? (
            playerData.roles.map((role, index) => (
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
            ))
          ) : (
            <LoadingIcon />
          )}
        </div>
        <div className="border-b-2 border-white/45 pb-2">
          {/* Team */}
          <div className="text-center">
            {playerData?.teamName ? (
              <Link
                to={`/stats/team/${encodeURIComponent(playerData.teamName)}`}
                className="text-white/60 hover:underline hover:text-white">
                {playerData.teamName}
              </Link>
            ) : null}
            {seasons && seasons.length > 0 && onSeasonChange && (
              <div className="flex justify-center">
                <select
                  className="mt-2 bg-light-gray text-white p-1 rounded-sm border border-gray text-sm w-full max-w-50"
                  value={selectedSeasonId || ""}
                  onChange={(e) => onSeasonChange(Number(e.target.value))}>
                  {seasons.map((season) => (
                    <option key={season.teamId} value={season.teamId}>
                      {season.seasonName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <ul className="quickStats flex flex-col gap-2">
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">Win Rate:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.winrate.toFixed(0) + "%"}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">Games:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.totalGames}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">KDA:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.kda.toFixed(2)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">Kill Participation:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgKillParticipation.toFixed(0) + "%"}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">CS/Min:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgCsPerMin.toFixed(1)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">Damage/Min:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgDamagePerMin.toFixed(0)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-white/55">Vision/Game:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgVisionScore.toFixed(1)}</p>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlayerStatSidebar;
