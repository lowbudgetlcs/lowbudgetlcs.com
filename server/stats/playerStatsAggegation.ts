import { getGamesForPlayer } from "../db/queries/statQueries/select";

interface ChampionStat {
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
  avgCs: number;
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
  kda: number;
  // Averages
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgCsPerMin: number;
  avgGoldPerMin: number;
  avgVisionScore: number;
  //   Player Roles
  roles: string[];
  // Champion Pool
  championPool: ChampionStat[];
  uniqueChampions: number;
  // Best Game Performances
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

  const initialChampionStats: { [key: string]: ChampionStat } = {};

  const stats = games.reduce(
    (acc, game) => {
      const player = game.participants.find((p) => p.playerPuuid === puuid);
      if (!player) return acc;

      const gameDurationMinutes = (player.timePlayed ?? 0) / 60;

      // Updates Totals
      acc.totalGames += 1;
      if (player.win) acc.wins += 1;
      acc.totalKills += player.kills ?? 0;
      acc.totalDeaths += player.deaths ?? 0;
      acc.totalAssists += player.assists ?? 0;
      acc.totalCS += player.totalMinionsKilled ?? 0;
      acc.totalGold += player.goldEarned ?? 0;
      acc.totalVisionScore += player.visionScore ?? 0;
      acc.totalDamageToChamps += player.totalDamageDealtToChampions ?? 0;

      // Updates Role Counts
      const role = player.teamPosition;
      if (role && role.length > 0) {
        // Check for a valid role string like 'TOP', 'JUNGLE', etc.
        acc.roleCounts[role] = (acc.roleCounts[role] || 0) + 1;
      }
      // Updates Best Game Stats
      if ((player.kills ?? 0) > acc.highestKills.value) {
        acc.highestKills = {
          value: player.kills ?? 0,
          matchId: game.matchId,
          championName: player.championName ?? "",
        };
      }
      if ((player.assists ?? 0) > acc.highestAssists.value) {
        acc.highestAssists = {
          value: player.assists ?? 0,
          matchId: game.matchId,
          championName: player.championName ?? "",
        };
      }
      if ((player.totalDamageDealtToChampions ?? 0) > acc.highestDamageToChamps.value) {
        acc.highestDamageToChamps = {
          value: player.totalDamageDealtToChampions ?? 0,
          matchId: game.matchId,
          championName: player.championName ?? "",
        };
      }
      if ((player.totalMinionsKilled ?? 0) > acc.highestCS.value) {
        acc.highestCS = {
          value: player.totalMinionsKilled ?? 0,
          matchId: game.matchId,
          championName: player.championName ?? "",
        };
      }
      if ((player.longestTimeSpentLiving ?? 0) > acc.longestTimeSpentLiving.value) {
        acc.longestTimeSpentLiving = {
          value: player.longestTimeSpentLiving ?? 0,
          matchId: game.matchId,
          championName: player.championName ?? "",
        };
      }

      // Updates Champion-Specific Stats
      const champName = player.championName ?? "Unknown";
      if (!acc.championStats[champName]) {
        acc.championStats[champName] = {
          championName: champName,
          championId: player.championId,
          games: 0,
          wins: 0,
          losses: 0,
          winrate: 0,
          kda: 0,
          avgKills: 0,
          avgDeaths: 0,
          avgAssists: 0,
          avgCs: 0,
        };
      }
      const champ = acc.championStats[champName];
      champ.games += 1;
      if (player.win) champ.wins += 1;

      champ.avgKills += player.kills ?? 0;
      champ.avgDeaths += player.deaths ?? 0;
      champ.avgAssists += player.assists ?? 0;
      champ.avgCs += player.totalMinionsKilled ?? 0;

      return acc;
    },
    // Initial object
    {
      totalGames: 0,
      wins: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalCS: 0,
      totalGold: 0,
      totalVisionScore: 0,
      totalDamageToChamps: 0,
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

  // Determines Player Roles
  const roles: string[] = [];
  if (stats.roleCounts) {
    const roleThreshold = 3; // Min games to be listed as a secondary role
    const sortedRoles = Object.entries(stats.roleCounts).sort(([, a], [, b]) => b - a);

    if (sortedRoles.length > 0) {
      roles.push(sortedRoles[0][0]);

      sortedRoles.slice(1).forEach(([role, count]) => {
        if (count >= roleThreshold) {
          roles.push(role);
        }
      });
    }
  }

  // its SUPPORT not UTILITY!!!!!!!!!
  const finalRoles = roles.map((role) => (role === "UTILITY" ? "SUPPORT" : role));

  // Final calculations for champion stats
  const championPool = Object.values(stats.championStats)
    .map((champ) => {
      champ.losses = champ.games - champ.wins;
      champ.winrate = (champ.wins / champ.games) * 100;
      champ.avgKills /= champ.games;
      champ.avgDeaths /= champ.games;
      champ.avgAssists /= champ.games;
      champ.avgCs /= champ.games;
      champ.kda =
        (champ.avgKills + champ.avgAssists) / (champ.avgDeaths === 0 ? 1 : champ.avgDeaths);
      return champ;
    })
    .sort((a, b) => b.games - a.games); // Sorts by most games played

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
    avgCsPerMin: stats.totalCS / totalDurationMinutes,
    avgGoldPerMin: stats.totalGold / totalDurationMinutes,
    avgVisionScore: stats.totalVisionScore / totalGames,
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