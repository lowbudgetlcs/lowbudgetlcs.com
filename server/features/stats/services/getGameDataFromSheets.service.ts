import { google } from "googleapis";
import {
  getDivisionsForSeason,
  getLatestSeasonMatchesSpreadsheet,
  getTeamMatchReportSheet,
} from "../../../db/queries/select";

export interface SheetGameData {
  gameId: number;
  divisionId: number;
  draftLink: string;
  winningTeam: string;
  losingTeam: string;
  seriesId: string;
  gameNumber: number;
  seriesGameCount: number;
}

export interface ReportedSeriesGameMetadata {
  matchId: string;
  seriesId: string;
  seriesGameNumber: number;
  seriesGameCount: number;
}

interface SheetDivision {
  name: string;
  divisionId: number;
}

interface GameIdColumn {
  gameNumber: number;
  index: number;
}

interface ParsedSeriesGame {
  gameId: number;
  gameNumber: number;
}

const credentialsPath = "./credentials.json";
const matchReportingSheetName = "Match Reporting Form";

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const normalizeLeagueName = (leagueName: string) => leagueName.trim().toLowerCase();

const getMatchReportRows = async (spreadsheetId: string) => {
  const sheets = google.sheets({ version: "v4", auth });
  const sheetDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${matchReportingSheetName}'!A:AF`,
  });
  return sheetDataResponse.data.values ?? [];
};

const getGameIdColumns = (headerRow: string[]): GameIdColumn[] =>
  headerRow
    .flatMap((header, index) => {
      const match = header.match(/^Game (\d+) Game ID$/);
      return match ? [{ gameNumber: Number(match[1]), index }] : [];
    })
    .sort((a, b) => a.gameNumber - b.gameNumber);

const getSeriesGamesFromRow = (row: string[], gameIdColumns: GameIdColumn[]): ParsedSeriesGame[] =>
  gameIdColumns.flatMap(({ gameNumber, index }) => {
    const gameIdValue = row[index];
    if (!gameIdValue) {
      return [];
    }

    const gameId = Number.parseInt(gameIdValue, 10);
    return Number.isNaN(gameId) ? [] : [{ gameId, gameNumber }];
  });

const getReportedSeriesGameCount = (seriesGames: ParsedSeriesGame[]) =>
  Math.max(...seriesGames.map((game) => game.gameNumber));

const getGameDataFromSpreadsheet = async (spreadsheetId: string, divisions: SheetDivision[]) => {
  const rows = await getMatchReportRows(spreadsheetId);

  if (rows.length < 2) {
    console.log("[Game Data Grabber] No data found in the Match Reporting Form.");
    return [];
  }

  const headerRow = rows[0];
  const dataRows = rows.slice(1);
  const gameIdColumns = getGameIdColumns(headerRow);
  const divisionsByLeagueName = new Map(
    divisions.map((division) => [normalizeLeagueName(division.name), division]),
  );
  const teamColumnIndicesByLeagueName = new Map<string, { winningTeam: number; losingTeam: number }>();

  const headers = {
    leagueName: headerRow.indexOf("What league do you play in?"),
    draftLink: headerRow.indexOf("Enter the Draft Link"),
  };

  headerRow.forEach((header, index) => {
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
  if (gameIdColumns.length === 0) {
    throw new Error('No "Game <number> Game ID" columns found in the Match Reporting Form');
  }
  if (teamColumnIndicesByLeagueName.size === 0) {
    throw new Error("No league-specific winning and losing team columns found in the Match Reporting Form");
  }

  const allGamesData: SheetGameData[] = [];
  for (const row of dataRows) {
    const leagueName = row[headers.leagueName];
    const draftLink = row[headers.draftLink];
    const normalizedLeagueName = leagueName ? normalizeLeagueName(leagueName) : "";
    const division = divisionsByLeagueName.get(normalizedLeagueName);
    const teamColumnIndices = teamColumnIndicesByLeagueName.get(normalizedLeagueName);

    if (!draftLink || !division || !teamColumnIndices) {
      continue;
    }

    const winningTeam = row[teamColumnIndices.winningTeam];
    const losingTeam = row[teamColumnIndices.losingTeam];
    if (!winningTeam || !losingTeam) {
      continue;
    }

    const seriesGames = getSeriesGamesFromRow(row, gameIdColumns);
    if (seriesGames.length === 0) {
      continue;
    }

    const seriesId = `${division.divisionId}:${seriesGames[0].gameId}`;
    const seriesGameCount = getReportedSeriesGameCount(seriesGames);
    for (const game of seriesGames) {
      allGamesData.push({
        gameId: game.gameId,
        divisionId: division.divisionId,
        draftLink,
        winningTeam,
        losingTeam,
        seriesId,
        gameNumber: game.gameNumber,
        seriesGameCount,
      });
    }
  }

  console.log(`[Game ID Grabber] Found ${allGamesData.length} total game IDs.`);
  return allGamesData;
};

const getSeriesMetadataFromSpreadsheet = async (spreadsheetId: string): Promise<ReportedSeriesGameMetadata[]> => {
  const rows = await getMatchReportRows(spreadsheetId);
  if (rows.length < 2) {
    console.log("[Game Data Grabber] No data found in the Match Reporting Form.");
    return [];
  }

  const gameIdColumns = getGameIdColumns(rows[0]);
  if (gameIdColumns.length === 0) {
    throw new Error('No "Game <number> Game ID" columns found in the Match Reporting Form');
  }

  const metadata: ReportedSeriesGameMetadata[] = [];
  for (const row of rows.slice(1)) {
    const seriesGames = getSeriesGamesFromRow(row, gameIdColumns);
    if (seriesGames.length === 0) {
      continue;
    }

    const seriesId = `NA1_${seriesGames[0].gameId}`;
    const seriesGameCount = getReportedSeriesGameCount(seriesGames);
    for (const game of seriesGames) {
      metadata.push({
        matchId: `NA1_${game.gameId}`,
        seriesId,
        seriesGameNumber: game.gameNumber,
        seriesGameCount,
      });
    }
  }

  return metadata;
};

const getGameDataFromSheets = async () => {
  try {
    const divisionsData = await getDivisionsForSeason();
    const matchesSpreadsheet = await getLatestSeasonMatchesSpreadsheet();
    const matchReportingSpreadsheetId = matchesSpreadsheet?.trim();

    if (!matchReportingSpreadsheetId) {
      throw new Error("No match-reporting spreadsheet ID is configured for the most recent season");
    }

    console.log("[Game ID Grabber] Getting all game IDs from the Match Reporting Form...");
    return await getGameDataFromSpreadsheet(
      matchReportingSpreadsheetId,
      divisionsData.flatMap((division) =>
        division.divisionId === null ? [] : [{ name: division.name, divisionId: division.divisionId }],
      ),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [Game ID Grabber] ERROR fetching game data from sheets:", message);
    return null;
  }
};

export const getTeamGameSeriesMetadataFromSheets = async (
  teamId: number,
): Promise<ReportedSeriesGameMetadata[] | null> => {
  const teamMatchSheet = await getTeamMatchReportSheet(teamId);
  const spreadsheetId = teamMatchSheet?.matchesSpreadsheet?.trim();

  if (!spreadsheetId) {
    return null;
  }

  return getSeriesMetadataFromSpreadsheet(spreadsheetId);
};

export default getGameDataFromSheets;
