import {
  getAllGameIDs,
  getIdFromPerformance,
  getPlayer,
  getPlayerGameStats,
  getPlayers,
  getTeamGameStats,
  getTournamentCodes,
} from "./db/queries/select";


interface GameListProps {
  gameId: number,
  win: boolean
  players: Array<object>
}

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
  try {
    let gameList: Array<GameListProps> = [];
    const gameIds = await getAllGameIDs(teamID); // Fetch all game IDs
    const rawGames = await getTeamGameStats(teamID); // Fetch raw game and player stats

    gameIds.forEach(({ gameId, teamWinId }) => {
      // Check if the gameId already exists in gameList
      const existingGame = gameList.find((game) => game.gameId === gameId);

      if (!existingGame) {
        // Create a new entry for this game
        const gameObject = {
          gameId,
          win: false,
          players: [] as Array<object>,
        };

        // Find and add all players for this game
        rawGames.forEach((game) => {
          if(teamID === teamWinId) {
            gameObject.win = true
          }
          if (game.gameId === gameId) {
            gameObject.players.push({
              playerId: game.playerId,
              playerName: game.playerName,
              stats: game.playerStats,
            });
          }
        });

        // Add the game to the game list
        gameList.push(gameObject);
      }
    });

    return gameList;
  } catch (err) {
    console.error("Error fetching team games:", err);
    throw err;
  }
};

//TODO: turn this into match history function
// export const getAllTeamGames = async (teamID: number) => {
//   try {
//     let gameList: Array<GameListProps> = [];
//     const gameIds = await getAllGameIDs(teamID); // Fetch all game IDs
//     const rawGames = await getTeamGameStats(teamID); // Fetch raw game and player stats

//     gameIds.forEach(({ gameId, teamWinId }) => {
//       // Check if the gameId already exists in gameList
//       const existingGame = gameList.find((game) => game.gameId === gameId);

//       if (!existingGame) {
//         // Create a new entry for this game
//         const gameObject = {
//           gameId,
//           win: false,
//           players: [] as Array<object>,
//         };

//         // Find and add all players for this game
//         rawGames.forEach((game) => {
//           if(teamID === teamWinId) {
//             gameObject.win = true
//           }
//           if (game.gameId === gameId) {
//             gameObject.players.push({
//               playerId: game.playerId,
//               playerName: game.playerName,
//               stats: game.playerStats,
//             });
//           }
//         });

//         // Add the game to the game list
//         gameList.push(gameObject);
//       }
//     });

//     return gameList;
//   } catch (err) {
//     console.error("Error fetching team games:", err);
//     throw err;
//   }
// };

