import { google } from "googleapis";
import path from "path";
import { getDivisionsForSeason } from "../../../db/queries/select";
import getPlayerPuuid from "../../getPlayerPuuid";
import parseSimpleDateString from "../../utils/parseSimpleDateString";
import teamHistoryUpdate from "../updateTeamServices/teamHistoryUpdater";
import { DbPlayer } from "./playerDbNameUpdater";
import delay from "../../utils/delay";

const credentialsPath = path.join(__dirname, "../../../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const playerSheetUpdaterService = async () => {
  try {
    console.log("🚀 [Sheet Player Reader] Starting daily player update from Google Sheets...");

    let requestCount = 0;
    const rateLimit = 95;
    const timeToWait = 120000; // 2 minutes in milliseconds

    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();

    const players: DbPlayer[] = [];

    // Step 1: Collects account entries from sheets.
    // Deduplicates by summonerName+tagLine to avoid duplicate Riot API requests.
    const accountsMap = new Map<
      string,
      {
        summonerName: string;
        tagLine: string;
        teamState: string;
        teamName: string;
        dateRaw?: string;
        divisionId: number;
      }
    >();

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
        if (!accountsMap.has(key)) {
          accountsMap.set(key, {
            summonerName,
            tagLine,
            teamState,
            teamName,
            dateRaw: date,
            divisionId: division.divisionId ?? 0,
          });
        }
      }
    }

    if (accountsMap.size === 0) {
      console.log("[Sheet Player Reader] No players found in any Roster Log.");
      return null;
    }

    console.log(
      `[Sheet Player Reader] Found ${accountsMap.size} unique account(s).`
    );

    // Step 2: call Riot API only for unique accounts and build players list.
    const uniqueAccounts = Array.from(accountsMap.values());
    for (const acc of uniqueAccounts) {
      if (requestCount >= rateLimit) {
        console.log(`⏱️ Rate limit of ${rateLimit} reached for Riot. Pausing for 2 minutes...`);
        await delay(timeToWait);
        requestCount = 0;
        console.log("✅ Resuming API calls for Riot.");
      }

      const getAccount = await getPlayerPuuid(acc.summonerName, acc.tagLine);
      requestCount++;
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

      players.push({
        summonerName: acc.summonerName,
        tagLine: acc.tagLine,
        puuid,
        teamState: acc.teamState === "R" ? "Remove" : "Add",
        teamName: acc.teamName,
        //! Needs Changing Every Season
        date: acc.dateRaw ? parseSimpleDateString(acc.dateRaw) : parseSimpleDateString("7/01"),
        divisionId: acc.divisionId,
      });
    }

    console.log(`[Sheet Player Reader] Completed Riot API calls. Collected ${players.length} player(s).`);

    // Final dedupe by puuid (in case multiple accounts map to same puuid)
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
    console.error("❌ [Sheet Player Reader] ERROR during daily player update:", err.message);
    return null;
  }
};
