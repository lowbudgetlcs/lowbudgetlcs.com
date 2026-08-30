import { google } from "googleapis";
import { getDivisionsForSeason, getLatestSeasonMatchesSpreadsheet } from "../../../db/queries/select";

export interface SheetGameData {
  gameId: number;
  divisionId: number;
  draftLink: string;
  winningTeam: string;
  losingTeam: string;
}

const credentialsPath = "./credentials.json";
const matchReportingSheetName = "Match Reporting Form";

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const normalizeLeagueName = (leagueName: string) => leagueName.trim().toLowerCase();

const getGameDataFromSheets = async () => {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();
    const allGamesData: SheetGameData[] = [];
    const divisionIdsByLeagueName = new Map<string, number>();

    for (const division of divisionsData) {
      if (division.divisionId) {
        divisionIdsByLeagueName.set(normalizeLeagueName(division.name), division.divisionId);
      }
    }

    const matchesSpreadsheet = await getLatestSeasonMatchesSpreadsheet();
    const matchReportingSpreadsheetId = matchesSpreadsheet?.trim();

    if (!matchReportingSpreadsheetId) {
      throw new Error("No match-reporting spreadsheet ID is configured for the most recent season");
    }

    console.log("[Game ID Grabber] Getting all game IDs from the Match Reporting Form...");
    const sheetDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: matchReportingSpreadsheetId,
      range: `'${matchReportingSheetName}'!A:AF`,
    });

    const rows = sheetDataResponse.data.values;

    if (!rows || rows.length < 2) {
      console.log("[Game Data Grabber] No data found in the Match Reporting Form.");
      return allGamesData;
    }

    const headerRow = rows[0];
    const dataRows = rows.slice(1);
    const gameIdIndices: number[] = [];
    const teamColumnIndicesByLeagueName = new Map<string, { winningTeam: number; losingTeam: number }>();

    const headers = {
      leagueName: headerRow.indexOf("What league do you play in?"),
      draftLink: headerRow.indexOf("Enter the Draft Link"),
    };

    headerRow.forEach((header, index) => {
      if (/^Game \d+ Game ID$/.test(header)) {
        gameIdIndices.push(index);
      }

      const winningTeamHeaderMatch = header.match(/^(.+) - Winning Team$/);
      if (!winningTeamHeaderMatch) {
        return;
      }

      const leagueName = winningTeamHeaderMatch[1];
      const losingTeamIndex = headerRow.indexOf(`${leagueName} - Losing Team`);
      if (losingTeamIndex !== -1) {
        teamColumnIndicesByLeagueName.set(normalizeLeagueName(leagueName), {
          winningTeam: index,
          losingTeam: losingTeamIndex,
        });
      }
    });

    if (headers.leagueName === -1 || headers.draftLink === -1) {
      throw new Error("Missing required column headers in the Match Reporting Form");
    }
    if (gameIdIndices.length === 0) {
      throw new Error('No "Game <number> Game ID" columns found in the Match Reporting Form');
    }
    if (teamColumnIndicesByLeagueName.size === 0) {
      throw new Error("No league-specific winning and losing team columns found in the Match Reporting Form");
    }

    for (const row of dataRows) {
      const leagueName = row[headers.leagueName];
      const draftLink = row[headers.draftLink];
      const normalizedLeagueName = leagueName ? normalizeLeagueName(leagueName) : "";
      const divisionId = divisionIdsByLeagueName.get(normalizedLeagueName);
      const teamColumnIndices = teamColumnIndicesByLeagueName.get(normalizedLeagueName);

      if (!draftLink || !divisionId || !teamColumnIndices) {
        continue;
      }

      const winningTeam = row[teamColumnIndices.winningTeam];
      const losingTeam = row[teamColumnIndices.losingTeam];

      if (!winningTeam || !losingTeam) {
        continue;
      }

      for (const gameIdIndex of gameIdIndices) {
        const gameIdValue = row[gameIdIndex];

        if (gameIdValue && !isNaN(parseInt(gameIdValue, 10))) {
          allGamesData.push({
            gameId: parseInt(gameIdValue, 10),
            divisionId,
            draftLink,
            winningTeam,
            losingTeam,
          });
        }
      }
    }

    console.log(`[Game ID Grabber] Found ${allGamesData.length} total game IDs.`);
    return allGamesData;
  } catch (err: any) {
    console.error("❌ [Game ID Grabber] ERROR fetching game data from sheets:", err.message);
    return null;
  }
};

export default getGameDataFromSheets;
