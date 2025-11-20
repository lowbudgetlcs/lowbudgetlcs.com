// import functionToInsertDataIntoDB from './your-db-insert-function';

import { insertFullMatchData } from "../db/queries/insert";
import { getExistingMatchIds } from "../db/queries/select";
import getGameDataFromApi from "./insertGames/getGameDataFromApi";
import getGameDataFromSheets from "./insertGames/getGameDataFromSheets";
import processApiGameData from "./insertGames/processApiGameData";

const runDailyGameUpdate = async () => {
  try {
    console.log("[Game Stats Updater] 1/4 Getting game data from Sheets");

    // Step 1: Gets raw series data from Sheets
    const sheetData = await getGameDataFromSheets();
    if (!sheetData) {
      console.error("[Game Stats Updater] ❌ Job finished: No data from sheets.");
      return;
    }

    // Step 2: Checks for games already within the DB by gameID
    console.log("[Game Stats Updater] 2/4 Checking DB for existing games before calling Riot API...");
    const allMatchIds = sheetData.map((g) => `NA1_${g.gameId}`);
    const existingIds = await getExistingMatchIds(allMatchIds);
    const existingSet = new Set(existingIds);
    const gamesToQuery = sheetData.filter((g) => !existingSet.has(`NA1_${g.gameId}`));

    if (gamesToQuery.length === 0) {
      console.log("[Game Stats Updater] ✅ Job finished: All games already exist in DB.");
      return;
    }

    // Step 3: Gets data from Riot API for new games
    console.log("[Game Stats Updater] 3/5 Fetching game data from Riot API for new games...");
    const apiData = await getGameDataFromApi(gamesToQuery);
    if (!apiData || apiData.length === 0) {
      console.log("[Game Stats Updater] ✅ Job finished: No new games found from API.");
      return;
    }

    // Step 4: Processes the API data to find correct winners and team IDs
    console.log("[Game Stats Updater] 4/5 Processing game data...");
    const processedData = await processApiGameData(apiData);
    if (!processedData || processedData.length === 0) {
      console.error("[Game Stats Updater] ❌ Job finished: Could not process API data.");
      return;
    }

    // Step 5: Inserts the final, accurate data into your database
    console.log("[Game Stats Updater] 5/5 Inserting games into database...")
    const insertedGamesResponse = await insertFullMatchData(processedData);

    if (!insertedGamesResponse) {
      console.error("[Game Stats Updater] ❌ Job finished: Failed to insert games.");
      return;
    }

    console.log(`[Game Stats Updater] ✅ Job finished: Successfully inserted ${insertedGamesResponse} games.`);
  } catch (error) {
    console.error("[Game Stats Updater] ❌ Error during daily stats update:", error);
  }
};
export default runDailyGameUpdate;
