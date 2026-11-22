import type { getGamesForPlayer } from "../../../db/queries/statQueries/select";
import type { PlayerGameTrend, PlayerTeamAverage } from "../types/Player";

type PlayerGames = Awaited<ReturnType<typeof getGamesForPlayer>>;

const safeDivide = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);

const playerStatsInsights = (puuid: string, games: PlayerGames) => {
  let teammateGames = 0;
  let teammateWins = 0;
  let teammateKills = 0;
  let teammateDeaths = 0;
  let teammateAssists = 0;
  let teammateCs = 0;
  let teammateGold = 0;
  let teammateVision = 0;
  let teammateDamage = 0;
  let teammateDurationMinutes = 0;
  let teammateKillParticipation = 0;
  let teammateGoldShare = 0;
  let teammateDamageShare = 0;

  const gameTrends: PlayerGameTrend[] = [];
  const orderedGames = [...games].sort((a, b) => a.gameEndTimeStamp - b.gameEndTimeStamp);

  orderedGames.forEach((game) => {
    const player = game.participants.find((participant) => participant.playerPuuid === puuid);
    if (!player) return;

    const teamParticipants = game.participants.filter((participant) => participant.teamId === player.teamId);
    const teamTotals = teamParticipants.reduce(
      (totals, participant) => {
        totals.kills += participant.kills ?? 0;
        totals.gold += participant.goldEarned ?? 0;
        totals.damage += Number(participant.totalDamageDealtToChampions ?? 0);
        return totals;
      },
      { kills: 0, gold: 0, damage: 0 },
    );
    const durationMinutes = game.gameDuration / 60;

    teamParticipants.forEach((teammate) => {
      if (teammate.playerPuuid === puuid) return;

      const kills = teammate.kills ?? 0;
      const deaths = teammate.deaths ?? 0;
      const assists = teammate.assists ?? 0;

      teammateGames += 1;
      if (teammate.win) teammateWins += 1;
      teammateKills += kills;
      teammateDeaths += deaths;
      teammateAssists += assists;
      teammateCs += (teammate.totalMinionsKilled ?? 0) + (teammate.neutralMinionsKilled ?? 0);
      teammateGold += teammate.goldEarned ?? 0;
      teammateVision += teammate.visionScore ?? 0;
      teammateDamage += Number(teammate.totalDamageDealtToChampions ?? 0);
      teammateDurationMinutes += durationMinutes;
      teammateKillParticipation += safeDivide(kills + assists, teamTotals.kills);
      teammateGoldShare += safeDivide(teammate.goldEarned ?? 0, teamTotals.gold);
      teammateDamageShare += safeDivide(Number(teammate.totalDamageDealtToChampions ?? 0), teamTotals.damage);
    });

    const kills = player.kills ?? 0;
    const deaths = player.deaths ?? 0;
    const assists = player.assists ?? 0;
    const cs = (player.totalMinionsKilled ?? 0) + (player.neutralMinionsKilled ?? 0);

    gameTrends.push({
      gameNumber: gameTrends.length + 1,
      matchId: game.matchId,
      championName: player.championName ?? "Unknown",
      win: player.win,
      kda: safeDivide(kills + assists, deaths === 0 ? 1 : deaths),
      killParticipation: safeDivide((kills + assists) * 100, teamTotals.kills),
      csPerMin: safeDivide(cs, durationMinutes),
      damagePerMin: safeDivide(Number(player.totalDamageDealtToChampions ?? 0), durationMinutes),
    });
  });

  const teamAverage: PlayerTeamAverage | null =
    teammateGames === 0
      ? null
      : {
          winrate: safeDivide(teammateWins * 100, teammateGames),
          kda: safeDivide(teammateKills + teammateAssists, teammateDeaths === 0 ? 1 : teammateDeaths),
          avgDeaths: safeDivide(teammateDeaths, teammateGames),
          avgCsPerMin: safeDivide(teammateCs, teammateDurationMinutes),
          avgGoldPerMin: safeDivide(teammateGold, teammateDurationMinutes),
          avgVisionScore: safeDivide(teammateVision, teammateGames),
          avgDamagePerMin: safeDivide(teammateDamage, teammateDurationMinutes),
          avgKillParticipation: safeDivide(teammateKillParticipation * 100, teammateGames),
          avgGoldShare: safeDivide(teammateGoldShare * 100, teammateGames),
          avgDamageShare: safeDivide(teammateDamageShare * 100, teammateGames),
        };

  return { teamAverage, gameTrends };
};

export default playerStatsInsights;
