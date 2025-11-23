import { Link } from "react-router-dom";
import { RecentGame } from "../../../types/StatTypes";
import formatDuration from "../../../utils/formatDuration";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import SubdomainLink from "../../SubdomainLink";
import MainLink from "../../MainLink";
import { FaCrown } from "react-icons/fa";

const MiniGameCard = ({ game, teamName }: { game: RecentGame; teamName?: string }) => {
  const { teams: team1Info } = game.teams[0];
  const { teams: team2Info } = game.teams[1];
  const { match_team_stats: team1Stats } = game.teams[0];
  const { match_team_stats: team2Stats } = game.teams[1];
  if (!team1Stats || !team2Stats || !team1Info || !team2Info) return null;
  const timeSinceGamePlayed = Number(BigInt(Date.now()) - BigInt(game.gameEndTimeStamp));

  const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];
  const team1Id = team1Stats.teamId;
  const team2Id = team2Stats.teamId;

  // Filters and sorts players for the first team
  const sortedTeam1 = game.participants
    .filter((p) => p.teamId === team1Id)
    .sort((a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? ""));
  // Filters and sorts players for the second team
  const sortedTeam2 = game.participants
    .filter((p) => p.teamId === team2Id)
    .sort((a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? ""));

  const gameDurationMs = game.gameDuration * 1000;
  const getPlayerKey = (player: any, idx: number) =>
    player.riotIdGameName ||
    player.summonerName ||
    `${player.championName}-${player.teamPosition}-${player.teamId}-${idx}`;
  return (
    <div
      className={`flex flex-col justify-center ${
        !teamName
          ? team1Stats.win
            ? "bg-blue/30"
            : "bg-red/30"
          : team1Info.teamName === teamName
          ? team1Stats.win
            ? "bg-blue/30"
            : "bg-red/30"
          : team2Stats.win
          ? "bg-blue/30"
          : "bg-red/30"
      } rounded-md p-2 w-full`}>
      <div className="flex flex-col border-b-2 justify-center truncate mb-2">
        <h3 className="font-bold min-w-0 truncate flex gap-2">
          <Link
            className="truncate hover:underline flex gap-1 items-center"
            to={`/team/${encodeURIComponent(team1Info.teamName)}`}>
            {team1Stats.win && <FaCrown />}
            {team1Info.teamName}
          </Link>{" "}
          <span className="text-white/80">vs.</span>{" "}
          <Link
            className="truncate hover:underline flex gap-1 items-center"
            to={`/team/${encodeURIComponent(team2Info.teamName)}`}>
            {team2Stats.win && <FaCrown />}
            {team2Info.teamName}
          </Link>
        </h3>

        <div className="flex gap-2 items-center lg:hidden">
          <p className="text-sm font-bold">{formatDuration(gameDurationMs)}</p>
          <p className="text-xs text-white/80">{formatTimeAgo(timeSinceGamePlayed)}</p>
        </div>
      </div>
      <div className="btns flex items-center gap-2 mb-1">
        {game.fearlessCode ? (
          <SubdomainLink
            subdomain="draft"
            to={`/fearless/${game.fearlessCode}`}
            className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-0.5 text-sm">
            Fearless
          </SubdomainLink>
        ) : game.draftCode ? (
          <SubdomainLink
            subdomain="draft"
            to={`/draft/${game.draftCode}`}
            className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-0.5 text-sm">
            Draft
          </SubdomainLink>
        ) : null}
        <MainLink
          to={`/mh/${game.matchId.split("_")[1]}`}
          className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-1 text-sm">
          Match
        </MainLink>
      </div>
      <div className="flex items-center gap-32">
        <div className="hidden lg:flex flex-col">
          <p className="text-xs font-bold border-b-2">{formatDuration(gameDurationMs)}</p>
          <p className="text-xs text-white/80">{formatTimeAgo(timeSinceGamePlayed)}</p>
        </div>
        <div className="players flex items-center gap-2">
          <div className="flex flex-col items-start gap-0.5">
            {sortedTeam1.map((player, index) => (
              <div key={getPlayerKey(player, index)} className="flex items-center">
                <img
                  src={`https://cdn.communitydragon.org/latest/champion/${player.championName}/square`}
                  alt={player.championName || ""}
                  className="w-4 h-4 border-[0.5px] border-black mr-2"
                />
                <Link
                  to={(() => {
                    const gameName = player.riotIdGameName || player.summonerName || "";
                    const tagLine = player.riotIdTagLine || "";
                    if (tagLine && tagLine.trim().length > 0) {
                      return `/player/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
                    }
                    return `/player/${encodeURIComponent(gameName)}`;
                  })()}
                  className="flex truncate  hover:text-white hover:underline text-white/80">
                  <span className="text-xs">{player.riotIdGameName}</span>
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start ml-6 gap-0.5">
            {sortedTeam2.map((player, index) => (
              <div key={getPlayerKey(player, index)} className="flex items-center">
                <img
                  src={`https://cdn.communitydragon.org/latest/champion/${player.championName}/square`}
                  alt={player.championName || ""}
                  className="w-4 h-4 border-[0.5px] border-black mr-2"
                />
                <Link
                  to={(() => {
                    const gameName = player.riotIdGameName || player.summonerName || "";
                    const tagLine = player.riotIdTagLine || "";
                    if (tagLine && tagLine.trim().length > 0) {
                      return `/player/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
                    }
                    return `/player/${encodeURIComponent(gameName)}`;
                  })()}
                  className="flex truncate hover:text-white hover:underline text-white/80">
                  <span className="text-xs">{player.riotIdGameName}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MiniGameCard;
