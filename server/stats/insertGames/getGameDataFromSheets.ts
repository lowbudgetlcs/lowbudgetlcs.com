import { google } from "googleapis";
import path from "path";
import { getDivisionsForSeason } from "../../db/queries/select";

export interface SheetGameData {
  gameId: number;
  divisionId: number;
  draftLink: string;
  winningTeam: string;
  losingTeam: string;
}

const credentialsPath = path.join(__dirname, "../../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const getGameDataFromSheets = async () => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();
    const allGamesData: SheetGameData[] = [];

    for (const division of [divisionsData[0]]) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;
      console.log(`[Game ID Grabber] Getting all game IDs for ${divisionName} division...`);

      const sheetDataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "'Hidden Match Forms'!A:Z",
      });

      const rows = sheetDataResponse.data.values;

      if (!rows || rows.length < 2) {
        console.log(`[Game Data Grabber] No data found for ${divisionName} division.`);
        continue;
      }

      const headerRow = rows[0];
      const dataRows = rows.slice(1); // All rows except the header

      const headers = {
        draftLink: headerRow.indexOf("Please paste the draft link used for this series."),
        winningTeam: headerRow.indexOf("Winning Team"),
        losingTeam: headerRow.indexOf("Losing Team"),
        gameIdIndices: [] as number[],
      };

      headerRow.forEach((header, index) => {
        if (header === "Game ID (shown above)") {
          headers.gameIdIndices.push(index);
        }
      });

      // --- Process each row to extract game data ---
      for (const row of dataRows) {
        const draftLink = row[headers.draftLink];
        const winningTeam = row[headers.winningTeam];
        const losingTeam = row[headers.losingTeam];

        // If a row is missing info, skips it
        if (!draftLink || !winningTeam || !losingTeam || !division.divisionId) {
          continue;
        }
        for (const gameIdIndex of headers.gameIdIndices) {
          const gameIdValue = row[gameIdIndex];

          // Checks if there's a valid game ID in this column
          if (gameIdValue && !isNaN(parseInt(gameIdValue, 10))) {
            allGamesData.push({
              gameId: parseInt(gameIdValue, 10),
              divisionId: division.divisionId,
              draftLink: draftLink,
              winningTeam: winningTeam,
              losingTeam: losingTeam,
            });
          }
        }
      }
    }
    console.log(`[Game ID Grabber] Found ${allGamesData.length} total game IDs.`);
    return allGamesData;
  } catch (err: any) {
    console.error("❌ [Game ID Grabber] ERROR during daily stats update:", err.message);
    return null;
  }
};

export default getGameDataFromSheets;
