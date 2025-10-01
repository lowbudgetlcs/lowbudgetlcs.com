import { PlatformId, RiotAPI } from "@fightmegg/riot-api";
import { SheetGameData } from "./getGameDataFromSheets";
import { checkForGameId } from "../../db/queries/select";

const getIndividualApiMatchData = async (game: SheetGameData) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    const matchId = `NA1_${game.gameId}`;
    const dbGameCheck = await checkForGameId(matchId);
    if (dbGameCheck) return null;

    const apiResponse = await rAPI.matchV5.getMatchById({
      cluster: PlatformId.AMERICAS,
      matchId: matchId,
    });
    if (apiResponse.info.tournamentCode) {
      return {
        divisionId: game.divisionId,
        gameId: matchId,
        draftLink: game.draftLink,
        team1Name: game.winningTeam,
        team2Name: game.losingTeam,
        matchData: apiResponse,
      };
    }
    return null;
  } catch (err) {
    console.warn("[Game ID Grabber] No game found with matching ID: ", game.gameId);
    return null;
  }
};

export default getIndividualApiMatchData;
