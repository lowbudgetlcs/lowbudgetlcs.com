import { google } from "googleapis";
import path from "path";
import { getDivisionsForSeason } from "../../db/queries/select";
import delay from "../utils/delay";

export interface GameIdProps {
  gameId: number;
  divisionId: number;
}

const credentialsPath = path.join(__dirname, "../../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const getGameIdsFromSheets = async () => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();
    const gameIds: GameIdProps[] = [];

    let requestCount = 0;
    const rateLimit = 60;
    const timeToWait = 60000; // 1 minute in milliseconds

    for (const division of divisionsData) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;
      console.log(`[Game ID Grabber] Getting all game IDs for ${divisionName} division...`);
      const headerRowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "'Hidden Match Forms'!1:1",
      });

      const targetHeader = "Game ID (shown above)";
      const gameIdColumns: string[] = [];
      const headerRow: string[][] | undefined | null = headerRowResponse.data.values;

      if (!headerRow || headerRow.length === 0) {
        console.log(`[Game ID Grabber] No games found for ${divisionName} division.`);
        continue;
      }
      headerRow[0].forEach((header, index) => {
        if (header === targetHeader) {
          gameIdColumns.push((index + 10).toString(36).toUpperCase());
        }
      });
      for (const column of gameIdColumns) {
        if (requestCount >= rateLimit) {
          console.log(`⏱️ Rate limit of ${rateLimit} reached for Sheets. Pausing for 2 minutes...`);
          await delay(timeToWait);
          // Reset the counter after waiting
          requestCount = 0;
          console.log("✅ Resuming API calls for Sheets.");
        }

        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: `'Hidden Match Forms'!${column}:${column}`,
        });
        const rows = response.data.values;
        if (!rows || rows.length === 0 || !division.divisionId) {
          continue;
        }
        for (const row of rows) {
          const gameId = row[0];
          if (gameId) {
            gameIds.push({
                gameId: parseInt(gameId),
                divisionId: division.divisionId,
            });
          }
        }
      }
    }
    console.log(`[Game ID Grabber] Found ${gameIds.length} total game IDs.`);
    return gameIds;
  } catch (err: any) {
    console.error("❌ [Game ID Grabber] ERROR during daily stats update:", err.message);
    return null;
  }
};

export default getGameIdsFromSheets;
