import { google } from "googleapis";
import { getLatestSeasonMatchesSpreadsheet } from "../../../db/queries/select";

const credentialsPath = "./credentials.json";

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const normalizeSheetValue = (value: string) => value.trim().toLowerCase();

const getGoogleDriveFileId = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "drive.google.com") {
      return null;
    }

    return parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? parsedUrl.searchParams.get("id");
  } catch {
    return null;
  }
};

const getDisplayableLogoUrl = (url: string) => {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `/images/api/team-logo/${encodeURIComponent(fileId)}` : url;
};

export const getTeamLogoLookupKey = (divisionName: string, teamName: string) => {
  return `${normalizeSheetValue(divisionName)}:${normalizeSheetValue(teamName)}`;
};

export const getTeamLogosFromSheets = async () => {
  const matchReportingSpreadsheetId = (await getLatestSeasonMatchesSpreadsheet())?.trim();
  if (!matchReportingSpreadsheetId) {
    throw new Error("No match-reporting spreadsheet ID is configured for the most recent season");
  }

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: matchReportingSpreadsheetId,
    range: "'Teams'!A:E",
  });
  const teamLogos = new Map<string, string>();

  for (const row of response.data.values?.slice(1) ?? []) {
    const [leagueName, teamName, , teamLogo] = row;
    if (!leagueName || !teamName || !teamLogo) {
      continue;
    }

    teamLogos.set(getTeamLogoLookupKey(leagueName, teamName), getDisplayableLogoUrl(teamLogo));
  }

  return teamLogos;
};