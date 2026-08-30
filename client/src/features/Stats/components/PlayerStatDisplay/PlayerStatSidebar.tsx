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

const PlayerStatSidebar = ({ summonerName, tagLine, playerData, seasons, selectedSeasonId, onSeasonChange }: PlayerStatSidebarProps) => {
  return (
    <div className="statSideBar sticky w-full md:w-72 shrink-0 mb-4 md:mb-0 left-0 md:top-16 self-start">
      <div className="flex flex-col p-4 gap-3 bg-bg border border-border rounded-xl grow md:min-w-64">
        <h1 className="text-lg text-center font-bold">
          {summonerName} <span className="text-text-secondary">#{tagLine}</span>
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
                className="light:brightness-25"
                width={"30px"}
                height={"30px"}
              />
            ))
          ) : (
            <LoadingIcon />
          )}
        </div>
        <div className="border-b-2 border-border pb-3">
          {/* Team */}
          <div className="text-center">
            {playerData?.teamName ? (
              <Link
                to={`/stats/team/${encodeURIComponent(playerData.teamName)}`}
                className="text-text-secondary hover:underline hover:text-text-primary transition duration-200">
                {playerData.teamName}
              </Link>
            ) : null}
            {seasons && seasons.length > 0 && onSeasonChange && (
              <div className="flex justify-center">
                <select
                  className="mt-2 bg-bg-light text-text-secondary p-1 rounded-md border border-border text-sm w-full max-w-50"
                  value={selectedSeasonId || ""}
                  onChange={(e) => onSeasonChange(Number(e.target.value))}>
                  {seasons.map((season) => (
                    <option key={`${season.seasonId}-${season.teamId}`} value={season.seasonId}>
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
            <p className="text-text-secondary">Win Rate:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.winrate.toFixed(0) + "%"}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">Games:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.totalGames}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">KDA:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.kda.toFixed(2)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">Kill Participation:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgKillParticipation.toFixed(0) + "%"}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">CS/Min:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgCsPerMin.toFixed(1)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">Damage/Min:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgDamagePerMin.toFixed(0)}</p>}
          </li>
          <li className="statitem inline-flex justify-between">
            <p className="text-text-secondary">Vision/Game:</p>
            {!playerData ? <LoadingIcon /> : <p>{playerData.avgVisionScore.toFixed(1)}</p>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlayerStatSidebar;
