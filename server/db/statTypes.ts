export interface TeamProps {
  id: number;
  name: string;
  logo: string | null;
  captainId: number | null;
  divisionId: number | null;
}
// Remove duplicate teams from teams array
export interface GamesArrayProps {
  id: number;
  shortcode: string;
  gameNum: number;
  winnerId: number | null;
  loserId: number | null;
}
export interface GameDataArrayProps {
  id: number;
  teamPerformanceId: number;
  win: boolean;
  side: string;
  gold: number;
  gameLength: number;
  kills: number;
  barons: number;
  dragons: number;
  grubs: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  firstBaron: boolean;
  firstDragon: boolean;
  firstGrub: boolean;
  firstHerald: boolean;
  firstTower: boolean;
  firstInhibitor: boolean;
  firstBlood: boolean;
}

export interface TeamPerformanceProps {
  id: number;
  divisionId: number | null;
  teamId: number | null;
  gameId: number | null;
}

export interface PlayerGameDataProps {
  id: number;
  playerPerformanceId: number;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
  gold: number;
  visionScore: number;
  damage: number;
  healing: number;
  shielding: number;
  damageTaken: number;
  selfMitigatedDamage: number;
  damageToTurrets: number;
  longestLife: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  cs: number;
  championName: string;
  item0: number | null;
  item1: number | null;
  item2: number | null;
  item3: number | null;
  item4: number | null;
  item5: number | null;
  trinket: number | null;
  keystoneRune: number;
  secondaryTree: number;
  summoner1: number;
  summoner2: number;
}
export interface PlayerDataArrayProps {
  teamId: number | null;
  playerId: number;
  playerName: string;
  performanceData: PlayerGameDataProps;
}

export interface FullPlayerDataProps {
  team: TeamProps;
  teamData: GameDataArrayProps;
  players: PlayerDataArrayProps[];
}
