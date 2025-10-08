import { ParticipantDto } from "../../../types/MatchV5";
import { RecentGame } from "../../../types/StatTypes";
import formatDuration from "../../../utils/formatDuration";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import ItemDisplay from "../../MatchHistoryPage/MatchHistoryDisplay/ItemDisplay";
import Runes from "../../MatchHistoryPage/MatchHistoryDisplay/RuneDisplay/Runes";
import SummonerSpellsDisplay from "../../MatchHistoryPage/MatchHistoryDisplay/SummonerSpellsDisplay";

const PlayerGameCard = ({ game, puuid }: { game: RecentGame; puuid: string }) => {
  const { teams: team1Info } = game.teams[0];
  const { teams: team2Info } = game.teams[1];
  const { match_team_stats: team1Stats } = game.teams[0];
  const { match_team_stats: team2Stats } = game.teams[1];
  if (!team1Stats || !team2Stats || !team1Info || !team2Info) return null;
  const timeSinceGamePlayed = Number(BigInt(Date.now()) - BigInt(game.gameEndTimeStamp));

  const roleOrder = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

  // Filters and sorts players for the first team
  const sortedTeam1 = game.participants
    .slice(5, 10)
    .sort(
      (a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? "")
    );

  // Filters and sorts players for the second team
  const sortedTeam2 = game.participants
    .slice(0, 5)
    .sort(
      (a, b) => roleOrder.indexOf(a.teamPosition ?? "") - roleOrder.indexOf(b.teamPosition ?? "")
    );

  // Find team player was on (team 100 or team 200)
  let playerTeamId: number | null;
  const player = game.participants.find((p) => p.playerPuuid === puuid);
  if (player) {
    playerTeamId = player.teamId;
  } else {
    return null;
  }
  const championLink = `https://cdn.communitydragon.org/latest/champion/${player.championId}/square`;
  const gameDurationMs = game.gameDuration * 1000;
  return (
    <div
      className={`flex flex-col justify-center ${
        player.win ? "bg-blue/30" : "bg-red/30"
      } rounded-md p-2 w-full`}>
      <h3 className="font-bold truncate border-b-2 mb-2">
        {team1Info.teamName} <span className="text-white/80">vs.</span> {team2Info.teamName}
      </h3>

      <div className="flex items-center justify-between lg:pr-4">
        <div className="flex flex-col">
          <p className="text-xs font-bold border-b-2">{formatDuration(gameDurationMs)}</p>
          <p className="text-xs text-white/80">{formatTimeAgo(timeSinceGamePlayed)}</p>
        </div>
        <div className="individualChampInfo hidden md:flex items-center gap-1">
          <div className="champImage relative w-12 h-12 shrink-0">
            <img src={championLink} alt={` ${player.championName}`} />
            <p className="absolute bottom-0 right-0 text-xs rounded-md bg-black px-0.5">
              {player.champLevel}
            </p>
          </div>
          <div className="flex gap-1">
            <SummonerSpellsDisplay playerData={player as unknown as ParticipantDto} />
            <Runes playerData={player as unknown as ParticipantDto} />
          </div>
          <ItemDisplay playerData={player as unknown as ParticipantDto} />
        </div>

        <div className="players flex items-center">
          <div className="flex flex-col items-start gap-0.5">
            {sortedTeam1.map((player, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={`https://cdn.communitydragon.org/latest/champion/${player.championName}/square`}
                  alt={player.championName!}
                  className="w-4 h-4 border-[0.5px] border-black mr-2"
                />
                <p className="flex truncate">
                  <span className="text-xs text-white/95 truncate">{player.riotIdGameName}</span>
                </p>
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
                <p className="flex truncate">
                  <span className="text-xs text-white/95 truncate">{player.riotIdGameName}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerGameCard;
