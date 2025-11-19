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

interface BestGameStat {
  value: number;
  matchId: string;
  championName: string;
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

interface RosterPlayerStat {
  summonerName: string;
  gamesPlayed: number;
  winrate: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  roles?: string[];
  riotIdGameName?: string | null;
  riotIdTagLine?: string | null;
}

export interface TeamOverallStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  avgGameDuration: number;
  // Objective Stats
  avgBarons: number;
  avgDragons: number;
  avgTowers: number;
  avgInhibitors: number;
  avgGrubs: number; // Added Grubs
  avgAtakhan: number; // Added Atakhan
  firstBloodRate: number;
  firstTowerRate: number;
  // Roster Breakdown
  roster: RosterPlayerStat[];
}

export interface MatchParticipant {
  id: number;
  matchId: string;
  playerPuuid: string;
  participantId: number;
  teamId: number;
  championId: number;
  championName: string | null;
  championTransform: number | null;
  teamPosition: string | null;
  individualPosition: string | null;
  riotIdGameName: string | null;
  riotIdTagLine: string | null;
  role: string | null;
  summonerLevel: number | null;
  summonerName: string | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  bountyLevel: number | null;
  killingSprees: number | null;
  largestKillingSpree: number | null;
  largestMultiKill: number | null;
  doubleKills: number | null;
  tripleKills: number | null;
  quadraKills: number | null;
  pentaKills: number | null;
  unrealKills: number | null;
  totalDamageDealt: bigint | null;
  physicalDamageDealt: bigint | null;
  magicDamageDealt: bigint | null;
  trueDamageDealt: bigint | null;
  totalDamageDealtToChampions: bigint | null;
  physicalDamageDealtToChampions: bigint | null;
  magicDamageDealtToChampions: bigint | null;
  trueDamageDealtToChampions: bigint | null;
  largestCriticalStrike: number | null;
  totalDamageTaken: bigint | null;
  physicalDamageTaken: bigint | null;
  magicDamageTaken: bigint | null;
  trueDamageTaken: bigint | null;
  damageSelfMitigated: bigint | null;
  totalHeal: bigint | null;
  totalHealsOnTeammates: bigint | null;
  totalDamageShieldedOnTeammates: bigint | null;
  totalUnitsHealed: number | null;
  goldEarned: number | null;
  goldSpent: number | null;
  champExperience: number | null;
  champLevel: number | null;
  totalMinionsKilled: number | null;
  neutralMinionsKilled: number | null;
  totalAllyJungleMinionsKilled: number | null;
  totalEnemyJungleMinionsKilled: number | null;
  visionScore: number | null;
  wardsPlaced: number | null;
  wardsKilled: number | null;
  detectorWardsPlaced: number | null;
  sightWardsBoughtInGame: number | null;
  visionWardsBoughtInGame: number | null;
  damageDealtToBuildings: bigint | null;
  damageDealtToObjectives: bigint | null;
  damageDealtToTurrets: bigint | null;
  baronKills: number | null;
  dragonKills: number | null;
  inhibitorKills: number | null;
  inhibitorTakedowns: number | null;
  inhibitorsLost: number | null;
  nexusKills: number | null;
  nexusTakedowns: number | null;
  nexusLost: number | null;
  objectivesStolen: number | null;
  objectivesStolenAssists: number | null;
  turretKills: number | null;
  turretTakedowns: number | null;
  turretsLost: number | null;
  firstBloodAssist: boolean | null;
  firstBloodKill: boolean | null;
  firstTowerAssist: boolean | null;
  firstTowerKill: boolean | null;
  timePlayed: number | null;
  longestTimeSpentLiving: number | null;
  totalTimeSpentDead: number | null;
  totalTimeCcDealt: number | null;
  timeCcingOthers: number | null;
  itemsPurchased: number | null;
  consumablesPurchased: number | null;
  item0: number | null;
  item1: number | null;
  item2: number | null;
  item3: number | null;
  item4: number | null;
  item5: number | null;
  item6: number | null;
  summoner1Id: number | null;
  summoner2Id: number | null;
  summoner1Casts: number | null;
  summoner2Casts: number | null;
  spell1Casts: number | null;
  spell2Casts: number | null;
  spell3Casts: number | null;
  spell4Casts: number | null;
  allInPings: number | null;
  assistMePings: number | null;
  commandPings: number | null;
  enemyMissingPings: number | null;
  enemyVisionPings: number | null;
  getBackPings: number | null;
  holdPings: number | null;
  needVisionPings: number | null;
  onMyWayPings: number | null;
  pushPings: number | null;
  visionClearedPings: number | null;
  win: boolean;
  gameEndedInSurrender: boolean | null;
  gameEndedInEarlySurrender: boolean | null;
  teamEarlySurrendered: boolean | null;
  perks: unknown; // jsonb is typed as 'unknown'
  challenges: unknown; // jsonb is typed as 'unknown'
}

export interface MatchTeam {
  // Data from the 'website.match_team_stats' table
  match_team_stats: {
    id: number;
    matchId: string;
    teamId: number;
    riotTeamId: number;
    win: boolean;
    baronKills: number | null;
    dragonKills: number | null;
    inhibitorKills: number | null;
    riftHeraldKills: number | null;
    towerKills: number | null;
    hordeKills: number | null;
    atakhanKills: number | null;
  };
  // Data from the 'website.teams' table
  teams: {
    id: number;
    divisionId: number | null;
    teamName: string;
    teamTag: string | null;
    active: boolean;
    createdAt: Date | null;
    formerTeam: number | null;
  } | null;
}

export interface RecentGame {
  // data from the 'website.matches' table
  matchId: string;
  divisionId: number | null;
  gameVersion: string | null;
  gameCreation: bigint;
  gameDuration: number;
  gameStartTimeStamp: bigint;
  gameEndTimeStamp: bigint;
  endOfGameResult: string;
  queueId: number;
  teams: MatchTeam[];
  participants: MatchParticipant[];
  tournamentCode: string | null;
  draftCode: string | null;
  fearlessCode: string | null;
}
