import TeamStats from "./TeamStats";

export default interface MatchStats {
  matchId: string;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameVersion: string;
  gameDuration: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  blueTeam: TeamStats;
  redTeam: TeamStats;
  tournamentCode: string;
}
