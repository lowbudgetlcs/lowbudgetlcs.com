import { getSeriesData } from "../db/queries/select";

const seriesHandler = async (seriesId: number) => {
  try {
    const rawSeriesData = await getSeriesData(seriesId);

    if (!rawSeriesData) {
      throw new Error("Series not found");
    }

    const teams = rawSeriesData.teams;
    const games = rawSeriesData.games;

    // Gets array of game ids to search for player stats
    const gameIds = games.map((game) => game.id);

    teams.forEach((team) => {
      const gameWins = { gameWins: 0 };
      for (let i = 0; i < games.length; i++) {
        if (games[i].winnerId === team.id) {
          gameWins.gameWins++;
        }
      }
      Object.assign(team, gameWins);
    });

    const refinedSeriesData = {
      divisionInfo: rawSeriesData.divisionInfo,
      seriesInfo: rawSeriesData.seriesInfo,
      teamInfo: teams,
      gameIds: gameIds,
      gameData: rawSeriesData.gameData,
    };
    
    return refinedSeriesData;
  } catch (err) {
    console.error(err);
  }
};

export default seriesHandler;
