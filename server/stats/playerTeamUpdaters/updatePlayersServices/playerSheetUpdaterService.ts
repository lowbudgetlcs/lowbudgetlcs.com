import { google } from "googleapis";
import path from "path";
import { getDivisionsForSeason } from "../../../db/queries/select";
import getPlayerPuuid from "../../getPlayerPuuid";
import parseSimpleDateString from "../../utils/parseSimpleDateString";
import teamHistoryUpdate from "../updateTeamServices/teamHistoryUpdater";
import { DbPlayer } from "./playerDbNameUpdater";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

    for (const division of divisionsData) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;
      console.log(`[Sheet Player Reader] Updating player data for ${divisionName} division...`);
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
        if (requestCount >= rateLimit) {
          console.log(`⏱️ Rate limit of ${rateLimit} reached. Pausing for 2 minutes...`);
          await delay(timeToWait);
          // Reset the counter after waiting
          requestCount = 0;
          console.log("✅ Resuming API calls.");
        }

        const date: string | undefined = row[0];
        const teamState: string | undefined = row[1];
        const teamName: string | undefined = row[2];
        const points: number | undefined = row[3];
        const fullSummonerName: string | undefined = row[4];
        if (!fullSummonerName || !teamState || !teamName) continue;
        const lastHashIndex = fullSummonerName.lastIndexOf("#");
        if (lastHashIndex !== -1) {
          const summonerName = fullSummonerName.substring(0, lastHashIndex).trim();
          const tagLine = fullSummonerName.substring(lastHashIndex + 1).trim();
          if (summonerName && tagLine) {
            const getAccount = await getPlayerPuuid(summonerName, tagLine);
            requestCount++;
            if (!getAccount) {
              console.warn(
                "[Sheet Player Reader] No Account found for summoner: ",
                fullSummonerName
              );
              continue;
            }
            const puuid = getAccount.puuid;
            if (!puuid) {
              console.warn(
                "[Sheet Player Reader] No Account found for summoner: ",
                fullSummonerName
              );
              continue;
            }
            players.push({
              summonerName,
              tagLine,
              puuid,
              teamState: teamState === "R" ? "Remove" : "Add",
              teamName,
              //! Needs Changing Every Season
              date: date ? parseSimpleDateString(date) : parseSimpleDateString("7/01"),
              divisionId: division.divisionId,
            });
          }
        } else {
          console.warn(`[Sheet Player Reader] Summoner format incorrect: "${fullSummonerName}"`);
        }
      }

      if (players.length === 0) {
        console.log("[Sheet Player Reader] No players found in any Roster Log.");
        return [];
      }
    }
    // Update teams and team history
    await teamHistoryUpdate(players);

    console.log(
      `[Sheet Player Reader] Found ${players.length} total log entries. Deduplicating...`
    );
    const playerMap = new Map<string, DbPlayer>();
    for (const player of players) {
      playerMap.set(player.puuid, player);
    }

    const uniquePlayers = Array.from(playerMap.values());
    console.log(
      `[Sheet Player Reader] Deduplication complete. ${uniquePlayers.length} unique players found.`
    );

    return uniquePlayers;
  } catch (err: any) {
    console.error("❌ [Sheet Player Reader] ERROR during daily player update:", err.message);
    return [];
  }
};
