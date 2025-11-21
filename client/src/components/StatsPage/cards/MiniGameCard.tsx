import { Link } from "react-router-dom";
import { RecentGame } from "../../../types/StatTypes";
import formatDuration from "../../../utils/formatDuration";
import formatTimeAgo from "../../../utils/formatTimeAgo";

const MiniGameCard = ({ game }: { game: RecentGame }) => {
  const { teams: team1Info } = game.teams[0];
  const { teams: team2Info } = game.teams[1];
  const { match_team_stats: team1Stats } = game.teams[0];
  const { match_team_stats: team2Stats } = game.teams[1];
  if (!team1Stats || !team2Stats || !team1Info || !team2Info) return null;
  const timeSinceGamePlayed = Number(BigInt(Date.now()) - BigInt(game.gameEndTimeStamp));

  const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

  // Filters and sorts players for the first team
  const sortedTeam1 = game.participants
    .filter((p) => p.teamId === team1Stats.teamId)
    .sort(
      (a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? "")
    );

  // Filters and sorts players for the second team
  const sortedTeam2 = game.participants
    .filter((p) => p.teamId === team2Stats.teamId)
    .sort(
      (a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? "")
    );

  const gameDurationMs = game.gameDuration * 1000;
  return (
    <div
      className={`flex flex-col justify-center ${
        team1Stats.win ? "bg-blue/30" : "bg-red/30"
      } rounded-md p-2 w-full`}>
      <h3 className="font-bold truncate border-b-2 mb-2">
        {team1Info.teamName} <span className="text-white/80">vs.</span> {team2Info.teamName}
      </h3>
      <div className="flex items-center gap-32">
        <div className="flex flex-col">
          <p className="text-xs font-bold border-b-2">{formatDuration(gameDurationMs)}</p>
          <p className="text-xs text-white/80">{formatTimeAgo(timeSinceGamePlayed)}</p>
        </div>
        <div className="players flex items-center gap-2">
          <div className="flex flex-col items-start gap-0.5">
            {sortedTeam1.map((player, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={`https://cdn.communitydragon.org/latest/champion/${player.championName}/square`}
                  alt={player.championName!}
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
              <div key={index} className="flex items-center">
                <img
                  src={`https://cdn.communitydragon.org/latest/champion/${player.championName}/tile`}
                  alt={player.championName!}
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
