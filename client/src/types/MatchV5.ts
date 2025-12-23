/**
 * Represents the main data transfer object for a League of Legends match.
 */
export interface MatchDto {
  metadata: MetadataDto;
  info: InfoDto;
}

/**
 * Contains metadata about the match.
 */
export interface MetadataDto {
  dataVersion: string;
  matchId: string;
  participants: string[]; // List of participant PUUIDs
}

/**
 * Contains the core details of the match.
 */
export interface InfoDto {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp?: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: ParticipantDto[];
  platformId: string;
  queueId: number;
  teams: TeamDto[];
  tournamentCode?: string;
}

/**
 * Represents a team's performance and stats in the match.
 */
export interface TeamDto {
  bans: BanDto[];
  objectives: ObjectivesDto;
  teamId: 100 | 200; // 100 for blue side, 200 for red side
  win: boolean;
}

/**
 * Represents a single champion ban during the drafting phase.
 */
export interface BanDto {
  championId: number;
  pickTurn: number;
}

/**
 * Represents the objectives taken by a team.
 */
export interface ObjectivesDto {
  baron: ObjectiveDto;
  champion: ObjectiveDto;
  dragon: ObjectiveDto;
  inhibitor: ObjectiveDto;
  riftHerald: ObjectiveDto;
  tower: ObjectiveDto;
  atakhan: ObjectiveDto;
  horde: ObjectiveDto;
}

// Represents a single type of objective (e.g., Baron, Dragon).
export interface ObjectiveDto {
  first: boolean;
  kills: number;
}

/**
 * Represents a single participant's data for the match.
 */
export interface ParticipantDto {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY" | "Invalid";
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusTakedowns: number;
  nexusLost: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: PerksDto;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdGameName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: 100 | 200;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalAllyJungleMinionsKilled: number;
  totalEnemyJungleMinionsKilled: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

/**
 * Represents the runes and stat perks selected by a participant.
 */
export interface PerksDto {
  statPerks: PerkStatsDto;
  styles: PerkStyleDto[];
}

/**
 * Represents the stat mods selected (e.g., Attack Speed, Armor).
 */
export interface PerkStatsDto {
  defense: number;
  flex: number;
  offense: number;
}

/**
 * Represents a rune style (e.g., Precision, Domination) and the selections within it.
 */
export interface PerkStyleDto {
  description: string;
  selections: PerkStyleSelectionDto[];
  style: number; // The ID of the primary or secondary rune tree
}

/**
 * Represents a single rune selection within a style.
 */
export interface PerkStyleSelectionDto {
  perk: number; // The ID of the specific rune
  var1: number;
  var2: number;
  var3: number;
}
