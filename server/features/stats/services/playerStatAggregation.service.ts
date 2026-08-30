import { getGamesForPlayer } from "../../../db/queries/statQueries/select";
import { BestGameStat, ChampionStat, ChampionStatAccumulator, PlayerAggregationAccumulator, PlayerOverallStats, TeamShareTotals } from "../types/Player"; 

const createBestGameStat = (): BestGameStat => ({ value: -1, matchId: "", championName: "" });

const safeDivide = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);

const createChampionAccumulator = (championName: string, championId: number): ChampionStatAccumulator => ({
  championName,
  championId,
  games: 0,
  wins: 0,
  totalKills: 0,
  totalDeaths: 0,
  totalAssists: 0,
  totalCs: 0,
  totalGold: 0,
  totalVisionScore: 0,
  totalDamageToChamps: 0,
  totalDamageTaken: 0,
  totalDamageToObjectives: 0,
  totalControlWards: 0,
  totalTimePlayed: 0,
  totalKillParticipation: 0,
  totalGoldShare: 0,
  totalDamageShare: 0,
  totalDeathShare: 0,
  totalDamageTakenShare: 0,
});

const createEmptyAccumulator = (puuid: string): PlayerAggregationAccumulator => ({
  puuid,
  totalGames: 0,
  wins: 0,
  totalKills: 0,
  totalDeaths: 0,
  totalAssists: 0,
  totalCS: 0,
  totalGold: 0,
  totalVisionScore: 0,
  totalControlWards: 0,
  totalWardsPlaced: 0,
  totalDamageToChamps: 0,
  totalDamageToObjectives: 0,
  totalKillParticipation: 0,
  totalGoldShare: 0,
  totalDamageShare: 0,
  totalDeathShare: 0,
  totalDamageTakenShare: 0,
  roleCounts: {},
  highestKills: createBestGameStat(),
  highestAssists: createBestGameStat(),
  highestDamageToChamps: createBestGameStat(),
  highestCS: createBestGameStat(),
  longestTimeSpentLiving: createBestGameStat(),
  championStats: {},
});

const updateBestGameStat = (current: BestGameStat, candidateValue: number, matchId: string, championName: string): BestGameStat => {
  if (candidateValue <= current.value) return current;
  return {
    value: candidateValue,
    matchId,
    championName,
  };
};

const getTeamShareTotals = (
  participants: {
    teamId: number;
    kills: number | null;
    deaths: number | null;
    goldEarned: number | null;
    totalDamageDealtToChampions: number | string | null;
    totalDamageTaken: number | string | null;
  }[],
  teamId: number,
): TeamShareTotals =>
  participants
    .filter((participant) => participant.teamId === teamId)
    .reduce<TeamShareTotals>(
      (teamAcc, teammate) => {
        teamAcc.kills += teammate.kills ?? 0;
        teamAcc.deaths += teammate.deaths ?? 0;
        teamAcc.gold += teammate.goldEarned ?? 0;
        teamAcc.damageToChamps += Number(teammate.totalDamageDealtToChampions ?? 0);
        teamAcc.damageTaken += Number(teammate.totalDamageTaken ?? 0);
        return teamAcc;
      },
      { kills: 0, deaths: 0, gold: 0, damageToChamps: 0, damageTaken: 0 },
    );

const normalizeRole = (role: string) => (role === "UTILITY" ? "SUPPORT" : role);

const playerStatsAggregation = async (puuid: string, seasonId?: number): Promise<PlayerOverallStats | null> => {
  const games = await getGamesForPlayer(puuid, seasonId);

  const stats = games.reduce<PlayerAggregationAccumulator>((acc, game) => {
    const player = game.participants.find((participant) => participant.playerPuuid === puuid);
    if (!player) return acc;

    const teamTotals = getTeamShareTotals(game.participants, player.teamId);

    const kills = player.kills ?? 0;
    const deaths = player.deaths ?? 0;
    const assists = player.assists ?? 0;
    const cs = (player.totalMinionsKilled ?? 0) + (player.neutralMinionsKilled ?? 0);
    const gold = player.goldEarned ?? 0;
    const visionScore = player.visionScore ?? 0;
    const controlWards = player.visionWardsBoughtInGame ?? 0;
    const wardsPlaced = player.wardsPlaced ?? 0;
    const damageToChamps = Number(player.totalDamageDealtToChampions ?? 0);
    const damageTaken = Number(player.totalDamageTaken ?? 0);
    const damageToObjectives = Number(player.damageDealtToObjectives ?? 0);

    const killParticipation = safeDivide(kills + assists, teamTotals.kills);
    const goldShare = safeDivide(gold, teamTotals.gold);
    const damageShare = safeDivide(damageToChamps, teamTotals.damageToChamps);
    const deathShare = safeDivide(deaths, teamTotals.deaths);
    const damageTakenShare = safeDivide(damageTaken, teamTotals.damageTaken);

    acc.totalGames += 1;
    if (player.win) acc.wins += 1;
    acc.totalKills += kills;
    acc.totalDeaths += deaths;
    acc.totalAssists += assists;
    acc.totalCS += cs;
    acc.totalGold += gold;
    acc.totalVisionScore += visionScore;
    acc.totalControlWards += controlWards;
    acc.totalWardsPlaced += wardsPlaced;
    acc.totalDamageToChamps += damageToChamps;
    acc.totalDamageToObjectives += damageToObjectives;
    acc.totalKillParticipation += killParticipation;
    acc.totalGoldShare += goldShare;
    acc.totalDamageShare += damageShare;
    acc.totalDeathShare += deathShare;
    acc.totalDamageTakenShare += damageTakenShare;

    const matchId = game.matchId;
    const championName = player.championName ?? "Unknown";

    acc.highestKills = updateBestGameStat(acc.highestKills, kills, matchId, championName);
    acc.highestAssists = updateBestGameStat(acc.highestAssists, assists, matchId, championName);
    acc.highestDamageToChamps = updateBestGameStat(acc.highestDamageToChamps, damageToChamps, matchId, championName);
    acc.highestCS = updateBestGameStat(acc.highestCS, cs, matchId, championName);
    acc.longestTimeSpentLiving = updateBestGameStat(acc.longestTimeSpentLiving, player.longestTimeSpentLiving ?? 0, matchId, championName);

    if (player.teamPosition) {
      acc.roleCounts[player.teamPosition] = (acc.roleCounts[player.teamPosition] ?? 0) + 1;
    }

    if (!acc.championStats[championName]) {
      acc.championStats[championName] = createChampionAccumulator(championName, player.championId);
    }

    const championStats = acc.championStats[championName];
    championStats.games += 1;
    if (player.win) championStats.wins += 1;
    championStats.totalKills += kills;
    championStats.totalDeaths += deaths;
    championStats.totalAssists += assists;
    championStats.totalCs += cs;
    championStats.totalGold += gold;
    championStats.totalVisionScore += visionScore;
    championStats.totalControlWards += controlWards;
    championStats.totalDamageToChamps += damageToChamps;
    championStats.totalDamageTaken += damageTaken;
    championStats.totalDamageToObjectives += damageToObjectives;
    championStats.totalTimePlayed += player.timePlayed ?? 0;
    championStats.totalKillParticipation += killParticipation;
    championStats.totalGoldShare += goldShare;
    championStats.totalDamageShare += damageShare;
    championStats.totalDeathShare += deathShare;
    championStats.totalDamageTakenShare += damageTakenShare;

    return acc;
  }, createEmptyAccumulator(puuid));

  const totalGames = stats.totalGames;
  const totalDurationMinutes = games.reduce((total, game) => total + game.gameDuration / 60, 0);

  const finalRoles = Object.entries(stats.roleCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([role]) => normalizeRole(role));

  const championPool: ChampionStat[] = Object.values(stats.championStats)
    .map((champ) => {
      const champGames = champ.games;
      const champDurationMinutes = champ.totalTimePlayed > 0 ? champ.totalTimePlayed / 60 : 1;
      const kdaDeaths = champ.totalDeaths === 0 ? 1 : champ.totalDeaths;

      return {
        championName: champ.championName,
        championId: champ.championId,
        games: champGames,
        wins: champ.wins,
        losses: champGames - champ.wins,
        winrate: safeDivide(champ.wins * 100, champGames),
        kda: safeDivide(champ.totalKills + champ.totalAssists, kdaDeaths),
        avgKills: safeDivide(champ.totalKills, champGames),
        avgDeaths: safeDivide(champ.totalDeaths, champGames),
        avgAssists: safeDivide(champ.totalAssists, champGames),
        avgCsPerMin: safeDivide(champ.totalCs, champDurationMinutes),
        avgGoldPerMin: safeDivide(champ.totalGold, champDurationMinutes),
        avgVisionScore: safeDivide(champ.totalVisionScore, champGames),
        avgDamagePerMin: safeDivide(champ.totalDamageToChamps, champDurationMinutes),
        avgKillParticipation: safeDivide(champ.totalKillParticipation * 100, champGames),
        avgGoldShare: safeDivide(champ.totalGoldShare * 100, champGames),
        avgDamageShare: safeDivide(champ.totalDamageShare * 100, champGames),
        avgDeathShare: safeDivide(champ.totalDeathShare * 100, champGames),
        avgDamageTakenShare: safeDivide(champ.totalDamageTakenShare * 100, champGames),
        avgControlWards: safeDivide(champ.totalControlWards, champGames),
      };
    })
    .sort((a, b) => b.games - a.games);

  return {
    puuid: stats.puuid,
    totalGames: totalGames,
    wins: stats.wins,
    losses: totalGames - stats.wins,
    winrate: safeDivide(stats.wins * 100, totalGames),
    kda: safeDivide(stats.totalKills + stats.totalAssists, stats.totalDeaths === 0 ? 1 : stats.totalDeaths),
    avgKills: safeDivide(stats.totalKills, totalGames),
    avgDeaths: safeDivide(stats.totalDeaths, totalGames),
    avgAssists: safeDivide(stats.totalAssists, totalGames),
    avgCsPerMin: safeDivide(stats.totalCS, totalDurationMinutes),
    avgGoldPerMin: safeDivide(stats.totalGold, totalDurationMinutes),
    avgVisionScore: safeDivide(stats.totalVisionScore, totalGames),
    avgDamagePerMin: safeDivide(stats.totalDamageToChamps, totalDurationMinutes),
    avgDamageToObjectives: safeDivide(stats.totalDamageToObjectives, totalGames),
    avgControlWards: safeDivide(stats.totalControlWards, totalGames),
    avgWardsPlaced: safeDivide(stats.totalWardsPlaced, totalDurationMinutes),
    avgKillParticipation: safeDivide(stats.totalKillParticipation * 100, totalGames),
    avgGoldShare: safeDivide(stats.totalGoldShare * 100, totalGames),
    avgDamageShare: safeDivide(stats.totalDamageShare * 100, totalGames),
    avgDeathShare: safeDivide(stats.totalDeathShare * 100, totalGames),
    avgDamageTakenShare: safeDivide(stats.totalDamageTakenShare * 100, totalGames),
    roles: finalRoles,
    uniqueChampions: championPool.length,
    championPool,
    highestKills: stats.highestKills,
    highestAssists: stats.highestAssists,
    highestDamageToChamps: stats.highestDamageToChamps,
    highestCS: stats.highestCS,
    longestTimeSpentLiving: stats.longestTimeSpentLiving,
  };
};

export default playerStatsAggregation;
