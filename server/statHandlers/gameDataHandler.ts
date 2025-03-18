import { getPlayerStatData } from "../db/queries/select";

// Handles getting all player data for the series of games
const gameDataHandler = async (gameIds: number[]) => {
  const playerData = [];

  //   Loop through each game id to get all player stats for the games.
  for (let i = 0; i < gameIds.length; i++) {
    const playerStatResponse = await getPlayerStatData(gameIds[i]);
    if (!playerStatResponse) {
      throw new Error("Game not Found");
    }
    playerData.push(playerStatResponse);
  }

  return playerData;
};

export default gameDataHandler;
