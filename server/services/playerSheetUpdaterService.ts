import { google } from "googleapis";
import path from "path";
import { getDivisionsForSeason } from "../db/queries/select";
import getPlayerPuuid from "../stats/getPlayerPuuid";
import { get } from "http";
import nodeCron from "node-cron";

interface Player {
  summonerName: string;
  tagLine: string;
  puuid: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const credentialsPath = path.join(__dirname, "../credentials.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const playerSheetUpdaterService = async () => {
  try {
    console.log("🚀 [Cron Job] Starting daily player update from Google Sheets...");

    let requestCount = 0;
    const rateLimit = 80;
    const timeToWait = 120000; // 2 minutes in milliseconds

    const sheets = google.sheets({ version: "v4", auth });
    const divisionsData = await getDivisionsForSeason();

    for (const division of divisionsData) {
      const { name: divisionName, spreadSheetId: spreadsheetId } = division;
      console.log(`[Cron Job] Updating player data for ${divisionName} division...`);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "'Roster Log'!B3:F",
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log(
          `[Cron Job] No player data found for ${divisionName} division. Moving to next division.`
        );
        continue;
      }

      const players: Player[] = [];

      for (const row of rows) {
        if (requestCount >= rateLimit) {
          console.log(`⏱️ Rate limit of ${rateLimit} reached. Pausing for 2 minutes...`);
          await delay(timeToWait);
          // Reset the counter after waiting
          requestCount = 0;
          console.log("✅ Resuming API calls.");
        }

        const fullSummonerName: string | undefined = row[4];
        if (!fullSummonerName) continue;
        const lastHashIndex = fullSummonerName.lastIndexOf("#");
        if (lastHashIndex !== -1) {
          const summonerName = fullSummonerName.substring(0, lastHashIndex).trim();
          const tagLine = fullSummonerName.substring(lastHashIndex + 1).trim();
          if (summonerName && tagLine) {
            const getAccount = await getPlayerPuuid(summonerName, tagLine);
            requestCount++;
            if (!getAccount) {
              console.warn("[Cron Job] No Account found for summoner: ", fullSummonerName);
              continue;
            }
            const puuid = getAccount.puuid;

            players.push({
              summonerName,
              tagLine,
              puuid,
            });
          }
        } else {
          console.warn(`[Cron Job] Summoner format incorrect: "${fullSummonerName}"`);
        }
      }
    }
  } catch (err: any) {
    console.error("❌ [Cron Job] ERROR during daily player update:", err.message);
  }
};

export const schedulePlayerUpdate = () => {
  nodeCron.schedule(
    "0 3 * *",
    () => {
      console.log("--- Triggering Scheduled Player Update ---");
      playerSheetUpdaterService();
    },
    {
      timezone: "America/Chicago",
    }
  );

  console.log("👍 Player update job scheduled to run daily at 3:00 AM.");
};
