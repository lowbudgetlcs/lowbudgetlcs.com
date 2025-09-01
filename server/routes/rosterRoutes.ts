import express, { Request, Response } from "express";
const rosterRoutes = express.Router();
import path from "path";
import { google } from "googleapis";
import { getDivisionsForSeason } from "../db/queries/select";

interface Player {
  points: string;
  name: string;
}

interface Team {
  name: string;
  logo?: string;
  players: Player[];
  division: string;
}

interface Division {
  name: string;
  spreadsheetId: string;
}

const cache = new Map();
const CACHE_TTL = 36000000; // 10 hours

const credentialsPath = path.join(__dirname, "../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

rosterRoutes.get("/api/rosterdata", async (req: Request, res: Response) => {
  try {
    const cacheKey = "roster_data";
    const cachedData = cache.get(cacheKey);

    // Check if cached data exists and is still valid.
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return res.status(200).json(cachedData.data);
    }

    const sheets = google.sheets({ version: "v4", auth });
    const allTeams: Team[] = [];
    const divisionsData = await getDivisionsForSeason();
    const divisionNames = divisionsData.map((d) => d.name);

    for (const division of divisionsData) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;

      // Gets the named ranges from the spreadsheet metadata for the current division.
      const response = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: [],
        includeGridData: false,
      });

      const namedRanges = response.data.namedRanges;

      // Skips to the next division if no named ranges exist.
      if (!namedRanges) {
        console.warn(`No named ranges found for division: ${divisionName}`);
        continue;
      }

      // Since the named ranges will ONLY be the ones you want, we collect all of them.
      const rangeNames = namedRanges.map((range) => range.name as string).filter((name) => name);
      if (rangeNames.length === 0) {
        console.warn(`No valid named ranges found for division: ${divisionName}`);
        continue;
      }

      const batchResponse = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetId,
        ranges: rangeNames,
      });

      const valueRanges = batchResponse.data.valueRanges || [];

      // Iterates through the named ranges and fetch data for each team.
      for (const valueResponse of valueRanges) {
        const rows = valueResponse.values;

        if (rows && rows.length > 0) {
          const team: Team = {
            logo: rows[0][0] || null,
            name: rows[0][1] || "Team Name Don't Work",
            division: divisionName,
            players: [],
          };

          // Starts at the first player row and ends at the last one
          // limit set due to captain row at bottom rather than rows.length
          for (let i = 4; i < 14; i++) {
            const playerDataRow = rows[i];
            if (playerDataRow && playerDataRow[0] && playerDataRow[1]) {
              const player: Player = {
                points: playerDataRow[0] || "",
                name: playerDataRow[1] || "",
              };
              team.players.push(player);
            }
          }
          allTeams.push(team);
        }
      }
    }

    const responseData = {
      divisions: divisionNames,
      teams: allTeams,
    };
    // Stores the new data in the cache before returning it.
    cache.set(cacheKey, { timestamp: Date.now(), data: responseData });

    res.status(200).json(responseData);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default rosterRoutes;
