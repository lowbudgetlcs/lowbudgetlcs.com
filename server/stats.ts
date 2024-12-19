import {
  getIdFromPerformance,
  getPlayer,
  getPlayerGameStats,
  getPlayers,
  getTeamGameStats,
  getTournamentCodes,
} from "./db/queries/select";

export const getAllPlayerGames = async (summonerName: string) => {
  const games: Array<object> = [];
  try {
    const playerName = await getPlayer(summonerName);
    const performanceIds = await getIdFromPerformance(playerName[0].id);
    for (const performanceID of performanceIds) {
      const gameStats = await getPlayerGameStats(performanceID.performanceId);
      games.push(gameStats);
    }
    return games;
  } catch (err) {
    throw err;
  }
};

export const getAllTeamGames = async (teamID: number) => {
  // const games: Array<object> = [];
  try {
    const games = await getTeamGameStats(teamID);
    return games;
  } catch (err) {
    throw err;
  }
};
