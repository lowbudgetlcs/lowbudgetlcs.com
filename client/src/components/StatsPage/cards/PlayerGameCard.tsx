import { Link } from "react-router-dom";
import { ParticipantDto } from "../../../types/MatchV5";
import { RecentGame } from "../../../types/StatTypes";
import formatDuration from "../../../utils/formatDuration";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import ItemDisplay from "../../MatchHistoryPage/MatchHistoryDisplay/ItemDisplay";
import Runes from "../../MatchHistoryPage/MatchHistoryDisplay/RuneDisplay/Runes";
import SummonerSpellsDisplay from "../../MatchHistoryPage/MatchHistoryDisplay/SummonerSpellsDisplay";
import MainLink from "../../MainLink";
import SubdomainLink from "../../SubdomainLink";

const PlayerGameCard = ({
  game,
  puuid,
}: {
  game: RecentGame;
  puuid: string;
}) => {
  const { teams: team1Info } = game.teams[0];
  const { teams: team2Info } = game.teams[1];
  const { match_team_stats: team1Stats } = game.teams[0];
  const { match_team_stats: team2Stats } = game.teams[1];
  if (!team1Stats || !team2Stats || !team1Info || !team2Info) return null;
  const timeSinceGamePlayed = Number(
    BigInt(Date.now()) - BigInt(game.gameEndTimeStamp)
  );

  const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

  // Filters and sorts players for the first team
  const sortedTeam1 = game.participants
    .filter((p) => p.teamId === team1Stats.teamId)
    .sort(
      (a, b) =>
        roleOrder.indexOf(a.teamPosition ?? "") -
        roleOrder.indexOf(b.teamPosition ?? "")
    );

  // Filters and sorts players for the second team
  const sortedTeam2 = game.participants
    .filter((p) => p.teamId === team2Stats.teamId)
    .sort(
      (a, b) =>
        roleOrder.indexOf(a.teamPosition ?? "") -
        roleOrder.indexOf(b.teamPosition ?? "")
    );

  const player = game.participants.find((p) => p.playerPuuid === puuid);

  if (!player) {
    return null;
  }
  const championLink = `https://cdn.communitydragon.org/latest/champion/${player.championId}/square`;
  const gameDurationMs = game.gameDuration * 1000;
  const teamKills = game.participants
    .filter((p) => p.teamId === player.teamId)
    .reduce((sum, p) => sum + (p.kills || 0), 0);
  const kp =
    teamKills > 0
      ? (((player.kills || 0) + (player.assists || 0)) / teamKills) * 100
      : 0;

  return (
    <div
      className={`flex flex-col justify-center ${
        player.win ? "bg-blue/30" : "bg-red/30"
      } rounded-md p-2 w-full`}
    >
      <div className="flex flex-col border-b-2 justify-center truncate mb-2">
        <h3 className="font-bold min-w-0 truncate">
          {team1Info.teamName} <span className="text-white/80">vs.</span>{" "}
          {team2Info.teamName}
        </h3>

        <div className="flex gap-2 items-center lg:hidden">
          <p className="text-sm font-bold">{formatDuration(gameDurationMs)}</p>
          <p className="text-xs text-white/80">
            {formatTimeAgo(timeSinceGamePlayed)}
          </p>
        </div>
      </div>
      <div className="btns flex items-center gap-2">
        {game.fearlessCode ? (
          <SubdomainLink
            subdomain="draft"
            to={`/fearless/${game.fearlessCode}`}
            className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-0.5 text-sm"
          >
            Fearless
          </SubdomainLink>
        ) : game.draftCode ? (
          <SubdomainLink
            subdomain="draft"
            to={`/draft/${game.draftCode}`}
            className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-0.5 text-sm"
          >
            Draft
          </SubdomainLink>
        ) : null}
        <MainLink
          to={`/mh/${game.matchId.split("_")[1]}`}
          className="bg-gray hover:bg-orange transition duration-300 rounded-md px-2 py-1 text-sm"
        >
          Match
        </MainLink>
      </div>
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex flex-col">
          <p className="text-xs font-bold border-b-2">
            {formatDuration(gameDurationMs)}
          </p>
          <p className="text-xs text-white/80">
            {formatTimeAgo(timeSinceGamePlayed)}
          </p>
        </div>
        <div className="individualChampInfo flex items-center justify-between smd:justify-normal gap-1 w-full smd:w-fit">
          <div className="flex items-center gap-2">
            <div className="champImage relative w-12 h-12 shrink-0">
              <img src={championLink} alt={` ${player.championName}`} />
              <p className="absolute bottom-0 right-0 text-xs rounded-md bg-black px-0.5">
                {player.champLevel}
              </p>
            </div>
            <div className="flex gap-1">
              <SummonerSpellsDisplay
                playerData={player as unknown as ParticipantDto}
              />
              <Runes playerData={player as unknown as ParticipantDto} />
            </div>
          </div>

          <ItemDisplay playerData={player as unknown as ParticipantDto} />
          <div className="kda flex flex-col items-center shrink-0 w-20">
            <div className="flex font-bold justify-center">
              <p>{player.kills}</p>&nbsp;/&nbsp;
              <p className="text-red">{player.deaths}</p>
              &nbsp;/&nbsp;
              <p>{player.assists}</p>
            </div>
            <p className="text-white/60 text-sm">
              {(player.totalMinionsKilled || 0) +
                (player.neutralMinionsKilled || 0)}{" "}
              CS
            </p>
            <p className="text-white/60 text-sm">{kp.toFixed(0)}% KP</p>
          </div>
        </div>

        <div className="players hidden smd:flex items-center truncate w-48">
          <div className="flex flex-col items-start gap-0.5 truncate">
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
                  className="flex truncate hover:text-white hover:underline text-white/80"
                >
                  <span className="text-xs truncate">
                    {player.riotIdGameName}
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start ml-2 gap-0.5 truncate">
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
                  className="flex truncate hover:text-white hover:underline text-white/80"
                >
                  <span className="text-xs truncate">
                    {player.riotIdGameName}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerGameCard;
