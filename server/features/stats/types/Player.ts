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

export interface ChampionStatAccumulator {
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
  totalDamageTakenShare: number;
}

export interface BestGameStat {
  value: number;
  matchId: string;
  championName: string;
}

export interface TeamShareTotals {
  kills: number;
  deaths: number;
  gold: number;
  damageToChamps: number;
  damageTaken: number;
}

export interface PlayerAggregationAccumulator {
  puuid: string;
  totalGames: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalCS: number;
  totalGold: number;
  totalVisionScore: number;
  totalControlWards: number;
  totalWardsPlaced: number;
  totalDamageToChamps: number;
  totalDamageToObjectives: number;
  totalKillParticipation: number;
  totalGoldShare: number;
  totalDamageShare: number;
  totalDeathShare: number;
  totalDamageTakenShare: number;
  roleCounts: Record<string, number>;
  highestKills: BestGameStat;
  highestAssists: BestGameStat;
  highestDamageToChamps: BestGameStat;
  highestCS: BestGameStat;
  longestTimeSpentLiving: BestGameStat;
  championStats: Record<string, ChampionStatAccumulator>;
}

export interface PlayerOverallStats {
  puuid: string;
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
  avgWardsPlaced: number;
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