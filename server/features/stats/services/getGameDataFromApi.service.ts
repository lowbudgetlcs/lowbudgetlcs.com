import { RiotAPITypes } from "@fightmegg/riot-api";
import { SheetGameData } from "./getGameDataFromSheets.service";
import getIndividualApiMatchData from "./getIndividualApiData.service";
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
    const allMatchData: ApiMatchData[] = [];
    for (const game of sheetGames) {
      const checkGameId = await getIndividualApiMatchData(game);
      if (!checkGameId) continue;
      allMatchData.push(checkGameId);
    }
    return allMatchData;
  } catch (err) {
    console.error("[Game ID Grabber]Error getting Game Ids From Api: ", err);
    return [];
  }
};

export default getGameDataFromApi;
