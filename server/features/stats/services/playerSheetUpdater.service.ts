import { google } from "googleapis";
import { getDivisionsForSeason } from "../../../db/queries/select";
import getPlayerPuuid from "./getPlayerPuuid.service";
import parseSimpleDateString from "../utils/parseSimpleDateString";
import { DbPlayer } from "./playerDbNameUpdater.service";

const credentialsPath = "./credentials.json";

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

interface RawSheetEvent {
  summonerName: string;
  tagLine: string;
  teamState: string;
  teamName: string;
  dateRaw?: string;
  divisionId: number;
}

export const playerSheetUpdaterService = async () => {
  try {
    console.log("🚀 [Sheet Player Reader] Starting daily player update from Google Sheets...");

    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();

    // Step 1: Collect ALL raw events from sheets.
    // Track unique accounts separately to avoid duplicate Riot API requests.
    const allEvents: RawSheetEvent[] = [];
    const uniqueAccounts = new Map<string, { summonerName: string; tagLine: string }>();

    for (const division of divisionsData) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;
      console.log(`[Sheet Player Reader] Reading sheet for ${divisionName} division...`);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "'Roster Log'!B3:F",
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log(
          `[Sheet Player Reader] No player data found for ${divisionName} division. Moving to next division.`
        );
        continue;
      }

      for (const row of rows) {
        const date: string | undefined = row[0];
        const teamState: string | undefined = row[1];
        const teamName: string | undefined = row[2];
        const points: number | undefined = row[3];
        const fullSummonerName: string | undefined = row[4];
        if (!fullSummonerName || !teamState || !teamName) continue;
        const lastHashIndex = fullSummonerName.lastIndexOf("#");
        if (lastHashIndex === -1) {
          console.warn(`[Sheet Player Reader] Summoner format incorrect: "${fullSummonerName}"`);
          continue;
        }
        const summonerName = fullSummonerName.substring(0, lastHashIndex).trim();
        const tagLine = fullSummonerName.substring(lastHashIndex + 1).trim();
        if (!summonerName || !tagLine) continue;

        const key = `${summonerName.toLowerCase()}#${tagLine.toLowerCase()}`;

        // Collect ALL events (preserves Add + Remove for the same player)
        allEvents.push({
          summonerName,
          tagLine,
          teamState,
          teamName,
          dateRaw: date,
          divisionId: division.divisionId ?? 0,
        });

        // Track unique accounts for Riot API dedup
        if (!uniqueAccounts.has(key)) {
          uniqueAccounts.set(key, { summonerName, tagLine });
        }
      }
    }

    if (uniqueAccounts.size === 0) {
      console.log("[Sheet Player Reader] No players found in any Roster Log.");
      return null;
    }

    console.log(
      `[Sheet Player Reader] Found ${uniqueAccounts.size} unique account(s) across ${allEvents.length} event(s).`
    );
    console.log("[Sheet Player Reader] Starting Riot API lookups for unique accounts...");

    // Step 2: Call Riot API only for unique accounts, build puuid lookup map.
    const puuidMap = new Map<string, { puuid: string; summonerName: string; tagLine: string }>();
    for (const [key, acc] of uniqueAccounts) {
      const getAccount = await getPlayerPuuid(acc.summonerName, acc.tagLine);
      if (!getAccount) {
        console.warn(
          "[Sheet Player Reader] No Account found for summoner: ",
          `${acc.summonerName}#${acc.tagLine}`
        );
        continue;
      }
      const puuid = getAccount.puuid;
      if (!puuid) {
        console.warn(
          "[Sheet Player Reader] No PUUID returned for summoner: ",
          `${acc.summonerName}#${acc.tagLine}`
        );
        continue;
      }
      puuidMap.set(key, { puuid, summonerName: acc.summonerName, tagLine: acc.tagLine });
    }

    // Step 3: Map PUUIDs back to ALL events (preserves multiple Add/Remove per player).
    const players: DbPlayer[] = [];
    for (const event of allEvents) {
      const key = `${event.summonerName.toLowerCase()}#${event.tagLine.toLowerCase()}`;
      const account = puuidMap.get(key);
      if (!account) continue;

      players.push({
        summonerName: account.summonerName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        teamState: event.teamState === "R" ? "Remove" : "Add",
        teamName: event.teamName,
        date: parseSimpleDateString(event.dateRaw || null),
        divisionId: event.divisionId,
        hasSheetDate: !!event.dateRaw,
      });
    }

    console.log(`[Sheet Player Reader] Completed Riot API calls. Collected ${players.length} player event(s).`);

    // Final dedupe by puuid for name updates (takes latest entry per puuid)
    const playerMap = new Map<string, DbPlayer>();
    for (const player of players) {
      playerMap.set(player.puuid, player);
    }
    const uniquePlayers = Array.from(playerMap.values());
    console.log(`[Sheet Player Reader] Deduplication complete after Riot API calls. ${uniquePlayers.length} unique players found.`);

    return {
      players,
      uniquePlayers,
    };
  } catch (err: any) {
    console.error("❌ [Sheet Player Reader] ERROR during daily player update:", err);
    return null;
  }
};
