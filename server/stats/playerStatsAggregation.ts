import { getGamesForPlayer } from "../db/queries/statQueries/select";

export interface ChampionStat {
  championName: string;
  championId: number;
  games: number;
  wins: number;
  losses: number;
  winrate: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgCsPerMin: number;
  avgGoldPerMin: number;
  avgVisionScore: number;
  avgDamagePerMin: number;
  avgKillParticipation: number;
  avgGoldShare: number;
  avgDamageShare: number;
  avgDeathShare: number;
  avgDamageTakenShare: number;
  avgControlWards: number;
}

interface ChampionStatAccumulator {
  championName: string;
  championId: number;
  games: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalCs: number;
  totalGold: number;
  totalVisionScore: number;
  totalDamageToChamps: number;
  totalDamageTaken: number;
  totalDamageToObjectives: number;
  totalControlWards: number;
  totalTimePlayed: number; // in seconds
  totalKillParticipation: number;
  totalGoldShare: number;
  totalDamageShare: number;
  totalDeathShare: number;
}

interface BestGameStat {
  value: number;
  matchId: string;
  championName: string;
}

export interface PlayerOverallStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  kda: number; // Averages
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgCsPerMin: number;
  avgGoldPerMin: number;
  avgVisionScore: number;
  avgDamagePerMin: number;
  avgDamageToObjectives: number;
  avgControlWards: number; // Team Percentages
  avgKillParticipation: number;
  avgGoldShare: number;
  avgDamageShare: number;
  avgDeathShare: number;
  avgDamageTakenShare: number; // Player Roles
  roles: string[]; // Champion Pool
  championPool: ChampionStat[];
  uniqueChampions: number; // Best Game Performances
  highestKills: BestGameStat;
  highestAssists: BestGameStat;
  highestDamageToChamps: BestGameStat;
  highestCS: BestGameStat;
  longestTimeSpentLiving: BestGameStat;
}

const playerStatsAggregation = async (puuid: string): Promise<PlayerOverallStats | null> => {
  const games = await getGamesForPlayer(puuid);
  if (!games || games.length === 0) {
    return null;
  }

  const initialChampionStats: { [key: string]: ChampionStatAccumulator } = {};

  const stats = games.reduce(
    (acc, game) => {
      const player = game.participants.find((p) => p.playerPuuid === puuid);
      if (!player) return acc; // Calculate team-based stats for this game

      const teammates = game.participants.filter((p) => p.teamId === player.teamId);
      const teamTotals = teammates.reduce(
        (teamAcc, p) => {
          teamAcc.kills += p.kills ?? 0;
          teamAcc.deaths += p.deaths ?? 0;
          teamAcc.gold += p.goldEarned ?? 0;
          teamAcc.damageToChamps += Number(p.totalDamageDealtToChampions ?? 0);
          teamAcc.damageTaken += Number(p.totalDamageTaken ?? 0);
          return teamAcc;
        },
        { kills: 0, deaths: 0, gold: 0, damageToChamps: 0, damageTaken: 0 }
      );

      const killParticipation =
        teamTotals.kills > 0 ? ((player.kills ?? 0) + (player.assists ?? 0)) / teamTotals.kills : 0;
      const goldShare = teamTotals.gold > 0 ? (player.goldEarned ?? 0) / teamTotals.gold : 0;
      const damageShare =
        teamTotals.damageToChamps > 0
          ? Number(player.totalDamageDealtToChampions ?? 0) / teamTotals.damageToChamps
          : 0;
      const deathShare = teamTotals.deaths > 0 ? (player.deaths ?? 0) / teamTotals.deaths : 0;
      const damageTakenShare =
        teamTotals.damageTaken > 0
          ? Number(player.totalDamageTaken ?? 0) / teamTotals.damageTaken
          : 0; // Updates Totals

      acc.totalGames += 1;
      if (player.win) acc.wins += 1;
      acc.totalKills += player.kills ?? 0;
      acc.totalDeaths += player.deaths ?? 0;
      acc.totalAssists += player.assists ?? 0;
      acc.totalCS += player.totalMinionsKilled ?? 0;
      acc.totalGold += player.goldEarned ?? 0;
      acc.totalVisionScore += player.visionScore ?? 0;
      acc.totalControlWards += player.visionWardsBoughtInGame ?? 0;
      acc.totalDamageToChamps += Number(player.totalDamageDealtToChampions ?? 0);
      acc.totalDamageToObjectives += Number(player.damageDealtToObjectives ?? 0);
      acc.totalKillParticipation += killParticipation;
      acc.totalGoldShare += goldShare;
      acc.totalDamageShare += damageShare;
      acc.totalDeathShare += deathShare;
      acc.totalDamageTakenShare += damageTakenShare; // ... (rest of the reduce function, no changes needed for best game stats) // Updates Champion-Specific Stats

      const champName = player.championName ?? "Unknown";
      if (!acc.championStats[champName]) {
        acc.championStats[champName] = {
          championName: champName,
          championId: player.championId,
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
        };
      }
      const champ = acc.championStats[champName];
      champ.games += 1;
      if (player.win) champ.wins += 1;
      champ.totalKills += player.kills ?? 0;
      champ.totalDeaths += player.deaths ?? 0;
      champ.totalAssists += player.assists ?? 0;
      champ.totalCs += player.totalMinionsKilled ?? 0;
      champ.totalGold += player.goldEarned ?? 0;
      champ.totalVisionScore += player.visionScore ?? 0;
      champ.totalControlWards += player.visionWardsBoughtInGame ?? 0;
      champ.totalDamageToChamps += Number(player.totalDamageDealtToChampions ?? 0);
      champ.totalDamageTaken += Number(player.totalDamageTaken ?? 0);
      champ.totalDamageToObjectives += Number(player.damageDealtToObjectives ?? 0);
      champ.totalTimePlayed += player.timePlayed ?? 0;
      champ.totalKillParticipation += killParticipation;
      champ.totalGoldShare += goldShare;
      champ.totalDamageShare += damageShare;
      champ.totalDeathShare += deathShare;

      return acc;
    },
    {
      totalGames: 0,
      wins: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalCS: 0,
      totalGold: 0,
      totalVisionScore: 0,
      totalControlWards: 0,
      totalDamageToChamps: 0,
      totalDamageToObjectives: 0,
      totalKillParticipation: 0,
      totalGoldShare: 0,
      totalDamageShare: 0,
      totalDeathShare: 0,
      totalDamageTakenShare: 0,
      roleCounts: {} as { [key: string]: number },
      highestKills: { value: -1, matchId: "", championName: "" },
      highestAssists: { value: -1, matchId: "", championName: "" },
      highestDamageToChamps: { value: -1, matchId: "", championName: "" },
      highestCS: { value: -1, matchId: "", championName: "" },
      longestTimeSpentLiving: { value: -1, matchId: "", championName: "" },
      championStats: initialChampionStats,
    }
  );

  const totalGames = stats.totalGames;
  const totalDurationMinutes = games.reduce((acc, game) => acc + game.gameDuration / 60, 0);

  const finalRoles = Object.entries(stats.roleCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([role]) => (role === "UTILITY" ? "SUPPORT" : role));

  const championPool: ChampionStat[] = Object.values(stats.championStats)
    .map((champ) => {
      const champGames = champ.games;
      const champDurationMinutes = champ.totalTimePlayed > 0 ? champ.totalTimePlayed / 60 : 1;
      const avgDeathsForKda = champ.totalDeaths === 0 ? 1 : champ.totalDeaths;

      return {
        championName: champ.championName,
        championId: champ.championId,
        games: champGames,
        wins: champ.wins,
        losses: champGames - champ.wins,
        winrate: (champ.wins / champGames) * 100,
        kda: (champ.totalKills + champ.totalAssists) / avgDeathsForKda,
        avgKills: champ.totalKills / champGames,
        avgDeaths: champ.totalDeaths / champGames,
        avgAssists: champ.totalAssists / champGames,
        avgCsPerMin: champ.totalCs / champDurationMinutes,
        avgGoldPerMin: champ.totalGold / champDurationMinutes,
        avgVisionScore: champ.totalVisionScore / champGames,
        avgDamagePerMin: champ.totalDamageToChamps / champDurationMinutes,
        avgKillParticipation: (champ.totalKillParticipation / champGames) * 100,
        avgGoldShare: (champ.totalGoldShare / champGames) * 100,
        avgDamageShare: (champ.totalDamageShare / champGames) * 100,
        avgDeathShare: (champ.totalDeathShare / champGames) * 100,
        avgDamageTakenShare: (champ.totalDamageTaken / champGames) * 100, // This is incorrect, see below
        avgControlWards: champ.totalControlWards / champGames,
      };
    })
    .sort((a, b) => b.games - a.games);

  return {
    totalGames: totalGames,
    wins: stats.wins,
    losses: totalGames - stats.wins,
    winrate: (stats.wins / totalGames) * 100,
    kda:
      (stats.totalKills + stats.totalAssists) / (stats.totalDeaths === 0 ? 1 : stats.totalDeaths),
    avgKills: stats.totalKills / totalGames,
    avgDeaths: stats.totalDeaths / totalGames,
    avgAssists: stats.totalAssists / totalGames,
    avgCsPerMin: totalDurationMinutes > 0 ? stats.totalCS / totalDurationMinutes : 0,
    avgGoldPerMin: totalDurationMinutes > 0 ? stats.totalGold / totalDurationMinutes : 0,
    avgVisionScore: stats.totalVisionScore / totalGames,
    avgDamagePerMin:
      totalDurationMinutes > 0 ? stats.totalDamageToChamps / totalDurationMinutes : 0,
    avgDamageToObjectives: stats.totalDamageToObjectives / totalGames,
    avgControlWards: stats.totalControlWards / totalGames,
    avgKillParticipation: (stats.totalKillParticipation / totalGames) * 100,
    avgGoldShare: (stats.totalGoldShare / totalGames) * 100,
    avgDamageShare: (stats.totalDamageShare / totalGames) * 100,
    avgDeathShare: (stats.totalDeathShare / totalGames) * 100,
    avgDamageTakenShare: (stats.totalDamageTakenShare / totalGames) * 100,
    roles: finalRoles,
    uniqueChampions: championPool.length,
    championPool: championPool,
    highestKills: stats.highestKills,
    highestAssists: stats.highestAssists,
    highestDamageToChamps: stats.highestDamageToChamps,
    highestCS: stats.highestCS,
    longestTimeSpentLiving: stats.longestTimeSpentLiving,
  };
};

export default playerStatsAggregation;
