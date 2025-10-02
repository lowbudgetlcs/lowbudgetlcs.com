// import functionToInsertDataIntoDB from './your-db-insert-function';

import { insertFullMatchData } from "../db/queries/insert";
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

    // Step 2: Enriches with data from the Riot API
    console.log("[Game Stats Updater] 2/4 Fetching game data from Riot API...");
    const apiData = await getGameDataFromApi(sheetData);
    if (!apiData || apiData.length === 0) {
      console.log("[Game Stats Updater] ✅ Job finished: No new games found from API.");
      return;
    }

    // Step 3: Processes the API data to find correct winners and team IDs
    console.log("[Game Stats Updater] 3/4 Processing game data...");
    const processedData = await processApiGameData(apiData);
    if (!processedData || processedData.length === 0) {
      console.error("[Game Stats Updater] ❌ Job finished: Could not process API data.");
      return;
    }

    // Step 4: Inserts the final, accurate data into your database
    console.log("[Game Stats Updater] 4/4 Inserting games into database...")
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
