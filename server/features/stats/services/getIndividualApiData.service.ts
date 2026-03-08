import { PlatformId } from "@fightmegg/riot-api";
import { SheetGameData } from "./getGameDataFromSheets.service";
import { waitForRiotRateLimit } from "../../../utils/riotRateLimiter";
import { getRiotApiClient } from "../../../utils/riotApiClient";

const getIndividualApiMatchData = async (game: SheetGameData) => {
  try {
    const rAPI = getRiotApiClient();
    const matchId = `NA1_${game.gameId}`;

    await waitForRiotRateLimit();
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
