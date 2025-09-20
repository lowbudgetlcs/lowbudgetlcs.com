import { PlatformId, RiotAPI, RiotAPITypes } from "@fightmegg/riot-api";
import { checkForGameId } from "../../db/queries/select";
import { GameIdProps } from "./getGameIdsFromSheets";

const getGameDataFromApi = async (gameIds: GameIdProps[]) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    const allMatchData: RiotAPITypes.MatchV5.MatchDTO[] = [];
    for (const gameId of gameIds) {
      const matchId = `NA1_${gameId.gameId}`;
      const dbGameCheck = await checkForGameId(matchId);
      if (dbGameCheck) continue;

      const apiResponse = await rAPI.matchV5.getMatchById({
        cluster: PlatformId.AMERICAS,
        matchId: matchId,
      });
      if (apiResponse.info.tournamentCode) {
        allMatchData.push(apiResponse);
      }
    }
  } catch (err) {
    console.error("[Game ID Grabber]Error getting Game Ids From Api: ", err);
  }
};

export default getGameDataFromApi;
