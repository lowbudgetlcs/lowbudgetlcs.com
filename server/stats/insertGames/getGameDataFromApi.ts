import { PlatformId, RiotAPI, RiotAPITypes } from "@fightmegg/riot-api";
import { checkForGameId } from "../../db/queries/select";
import { SheetGameData } from "./getGameDataFromSheets";
import delay from "../utils/delay";
import getIndividualApiMatchData from "./getIndividualApiData";
export interface ApiMatchData {
  divisionId: number;
  gameId: string;
  draftLink: string;
  team1Name: string;
  team2Name: string;
  matchData: RiotAPITypes.MatchV5.MatchDTO;
}
const getGameDataFromApi = async (sheetGames: SheetGameData[]) => {
  try {
    let requestCount = 0;
    const rateLimit = 95;
    const timeToWait = 120000; // 2 minutes in milliseconds

    const allMatchData: ApiMatchData[] = [];
    for (const game of sheetGames) {
      if (requestCount >= rateLimit) {
        console.log(`⏱️ Rate limit of ${rateLimit} reached for Riot. Pausing for 2 minutes...`);
        await delay(timeToWait);
        // Reset the counter after waiting
        requestCount = 0;
        console.log("✅ Resuming API calls for Riot.");
      }
      const checkGameId = await getIndividualApiMatchData(game);
      if (!checkGameId) continue;
      allMatchData.push(checkGameId);
      requestCount++;
    }
    return allMatchData;
  } catch (err) {
    console.error("[Game ID Grabber]Error getting Game Ids From Api: ", err);
  }
};

export default getGameDataFromApi;
