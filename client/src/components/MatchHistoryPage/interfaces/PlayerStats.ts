interface RuneSelection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

interface RuneStyle {
  description: string;
  selections: RuneSelection[];
  style: number;
}

interface StatPerks {
  defense: number;
  flex: number;
  offense: number;
}

interface Runes {
  statPerks: StatPerks;
  styles: RuneStyle[];
}

interface Pings {
  allInPings: number;
  assistMePings: number;
  basicPings: number;
  commandPings: number;
  dangerPings: number;
  enemyMissingPings: number;
  enemyVisionPings: number;
  getBackPings: number;
  holdPings: number;
  needVisionPings: number;
  onMyWayPings: number;
  pushPings: number;
  retreatPings: number;
  visionClearedPings: number;
}

export default interface PlayerStats {
  playerName: string;
  puuid: string;
  championName: string;
  championId: number;
  teamPosition: string;
  champLevel: number;
  runes: Runes[];
  items: number[];
  summonerSpells: {
    summoner1Id: number;
    summoner2Id: number;
  };
  kills: number;
  deaths: number;
  assists: number;
  damageToChampions: number;
  damageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  visionScore: number;
  constrolWards: number;
  goldEarned: number;
  cs: number;
  pings: Pings;
}
