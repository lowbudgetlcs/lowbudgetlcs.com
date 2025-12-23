import topIcon from "../../../assets/laneIcons/topIcon.svg";
import middleIcon from "../../../assets/laneIcons/middleIcon.svg";
import bottomIcon from "../../../assets/laneIcons/bottomIcon.svg";
import supportIcon from "../../../assets/laneIcons/supportIcon.svg";
import jungleIcon from "../../../assets/laneIcons/jungleIcon.svg";
import LoadingIcon from "../../LoadingIcon";
import { Link } from "react-router-dom";
import { TeamOverallStats } from "../../../types/StatTypes";
import { useFetchData } from "../../../leagueData";
import { TeamSeason } from "../dataHandlers/getTeamSeasons";

interface TeamStatSidebarProps {
  teamName: string;
  teamData: TeamOverallStats | null;
  logo?: string | null;
  seasons?: TeamSeason[];
  selectedTeamId?: number | null;
  onSeasonChange?: (teamId: number) => void;
}

const TeamStatSidebar = ({
  teamName,
  teamData,
  logo: propLogo,
  seasons,
  selectedTeamId,
  onSeasonChange,
}: TeamStatSidebarProps) => {
  const { teams } = useFetchData();

  // find team logo if it exists
  const teamMeta = teams.find((t) => t.name.toLowerCase() === teamName.toLowerCase());
  // if the server provided a logo, prefer that; otherwise use roster fetch
  const logo = propLogo || teamMeta?.logo || null;

  return (
    <div className="statSideBar sticky w-full md:w-72 flex-shrink-0 mb-4 md:mb-0 left-0 md:top-24 self-start">
      <div className="flex flex-col p-4 gap-2 bg-gray/20 border-2 border-gray rounded-md flex-grow md:min-w-64 max-h-fit">
        <div className="flex flex-col items-center justify-center">
          {logo ? (
            <img src={logo} alt={`${teamName} logo`} className="w-28 h-28 object-contain mb-2" />
          ) : (
            <div className="w-24 h-24 bg-gray rounded-full mb-2" />
          )}
          <h1 className="text-lg text-center font-bold">{teamName}</h1>
          {seasons && seasons.length > 0 && onSeasonChange && (
            <select
              className="mt-2 bg-light-gray text-white p-1 rounded border border-gray text-sm w-full max-w-[200px]"
              value={selectedTeamId || ""}
              onChange={(e) => onSeasonChange(Number(e.target.value))}>
              {seasons.map((season) => (
                <option key={season.teamId} value={season.teamId}>
                  {season.seasonName} - {season.divisionName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="rankRole flex items-center border-b-2 border-white/45">
          <p className="text-white font-bold">Roster</p>
        </div>

        <div className="rosterList flex flex-col gap-2 overflow-y-auto max-h-80 pt-2">
          {!teamData ? (
            <LoadingIcon />
          ) : (
            teamData.roster.map((p) => (
              <Link
                to={(() => {
                  const gameName = p.riotIdGameName || p.summonerName;
                  const tagLine = p.riotIdTagLine || "";
                  if (p.gamesPlayed === 0) {
                    return "#";
                  }
                  if (tagLine && tagLine.trim().length > 0) {
                    return `/stats/player/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
                  }
                  return `/stats/player/${encodeURIComponent(gameName)}`;
                })()}
                key={p.summonerName}
                aria-label={`Player ${p.summonerName} profile`}
                className="p-2 rounded-md bg-gray/20 hover:bg-gray/30 transition duration-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Roles icons */}
                  <div className="flex gap-2 items-center">
                    {(p.roles || [])
                      .map((role, idx) => (
                        <img
                          key={idx}
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
                          title={
                            role === "TOP"
                              ? "Top"
                              : role === "JUNGLE"
                              ? "Jungle"
                              : role === "MIDDLE"
                              ? "Middle"
                              : role === "BOTTOM"
                              ? "Bottom"
                              : "Support"
                          }
                          width={24}
                          height={24}
                        />
                      ))
                      .slice(0, 1)}
                  </div>
                  <div className="flex flex-col truncate">
                    <p className="text-sm truncate">{p.riotIdGameName || p.summonerName.split("-")[0]}</p>
                    <p className="text-sm text-white/60">
                      #{p.riotIdTagLine || p.summonerName.split("-")[1]}
                    </p>
                  </div>
                </div>
                {p.gamesPlayed > 0 ? (
                  <div className="text-right">
                    <div className="text-xs text-white/60">Games: {p.gamesPlayed}</div>
                    <div className="text-xs text-white/60 whitespace-nowrap">
                      Winrate:{" "}
                      <span className={p.winrate < 50 ? "text-red/80" : "text-blue/80"}>
                        {p.winrate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-xs text-white/60">Unused</div>
                    <div className="text-xs text-white/60 whitespace-nowrap">Player</div>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamStatSidebar;
