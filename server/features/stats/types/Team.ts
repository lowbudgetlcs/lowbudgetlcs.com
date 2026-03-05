export interface RosterPlayerStat {
  summonerName: string;
  gamesPlayed: number;
  winrate: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  roles?: string[];
  riotIdGameName?: string;
  riotIdTagLine?: string;
}

export interface SidePerformance {
  games: number;
  wins: number;
  winrate: number;
}

export interface LaneDistribution {
  gold: number;
  damage: number;
  vision: number;
}

export interface TeamOverallStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  avgGameDuration: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgVisionScore: number;
  avgDamagePerMin: number;
  avgGoldPerMin: number;
  avgBarons: number;
  avgDragons: number;
  avgTowers: number;
  avgInhibitors: number;
  avgGrubs: number;
  avgHeralds: number;
  avgAtahkhan: number;
  firstBloodRate: number;
  firstTowerRate: number;
  firstDragonRate: number;
  firstBaronRate: number;
  firstInhibitorRate: number;
  dragonControlRate: number;
  voidGrubControlRate: number;
  blueSidePerformance: SidePerformance;
  redSidePerformance: SidePerformance;
  laneDistribution: Record<string, LaneDistribution>;
  goldDistribution?: Record<string, number>;
  damageDistribution?: Record<string, number>;
  visionDistribution?: Record<string, number>;
  roster: RosterPlayerStat[];
  customAchievements?: number[];
}

export const LANE_ROLES = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"] as const;
export type LaneRole = (typeof LANE_ROLES)[number];

export type RosterAccumulator = RosterPlayerStat & {
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  wins: number;
  roleCounts: Record<string, number>;
  gameName: string;
  tagLine: string;
};

export type AggregationAccumulator = {
  totalGames: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalGold: number;
  totalDamage: number;
  totalVisionScore: number;
  totalGameDuration: number;
  totalBarons: number;
  totalDragons: number;
  totalTowers: number;
  totalInhibitors: number;
  totalGrubs: number;
  totalAtakhan: number;
  totalHeralds: number;
  firstBloodCount: number;
  firstTowerCount: number;
  firstDragonCount: number;
  firstBaronCount: number;
  firstInhibitorCount: number;
  blueSideGames: number;
  blueSideWins: number;
  redSideGames: number;
  redSideWins: number;
  rosterStats: Record<string, RosterAccumulator>;
  laneDistribution: Record<LaneRole, LaneDistribution>;
};
