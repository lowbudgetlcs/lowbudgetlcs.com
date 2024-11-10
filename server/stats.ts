import {
  getIdFromPerformance,
  getPlayer,
  getPlayerGameStats,
  getPlayers,
  getTournamentCodes,
} from "./db/queries/select";

const getAllGames = async (summonerName: string) => {
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

export default getAllGames;
