import { ApiMatchData } from "./getGameDataFromApi";
import { findTeamIdByPlayers, getHistoricalTeamIdsByName } from "../../db/queries/select";
import { RiotAPITypes } from "@fightmegg/riot-api";

export interface ProcessedGameData {
  gameId: string;
  divisionId: number;
  draftLink: string;
  winningTeamId: number;
  losingTeamId: number;
  matchData: RiotAPITypes.MatchV5.MatchDTO;
}

const processApiGameData = async (apiMatches: ApiMatchData[]) => {
  const processedGames: ProcessedGameData[] = [];

  for (const match of apiMatches) {
    const participants = match.matchData.info.participants;

    // 1. Find the winning team's in-game ID (100 for blue, 200 for red)
    const winningParticipant = participants.find((p) => p.win);
    if (!winningParticipant) continue; // Skip if match data is inconclusive
    const winningRiotTeamId = winningParticipant.teamId;

    // 2. Separate participants into winning and losing player lists by their PUUIDs
    const winningPlayerPuuids = participants
      .filter((p) => p.teamId === winningRiotTeamId)
      .map((p) => p.puuid);
    const losingPlayerPuuids = participants
      .filter((p) => p.teamId !== winningRiotTeamId)
      .map((p) => p.puuid);

    // 3. Find the winning team's ID
    const winningTeamCandidates = await getHistoricalTeamIdsByName(match.team1Name);
    let finalWinningTeamId = await findTeamIdByPlayers(winningPlayerPuuids, winningTeamCandidates);
    if (!finalWinningTeamId && winningTeamCandidates.length === 1) {
      console.warn(
        `[Game Stats Updater] Failed finding Winning Team for: ${match.gameId}. Using possible TeamId: ${winningTeamCandidates[0]}`
      );
      finalWinningTeamId = winningTeamCandidates[0];
    }

    // 4. Find the losing team's ID
    const losingTeamCandidates = await getHistoricalTeamIdsByName(match.team2Name);
    let finalLosingTeamId = await findTeamIdByPlayers(losingPlayerPuuids, losingTeamCandidates);
    if (!finalLosingTeamId && losingTeamCandidates.length === 1) {
      console.warn(
        `[Game Stats Updater] Failed finding Losing Team for: ${match.gameId}. Using possible TeamId: ${losingTeamCandidates[0]}`
      );
      finalLosingTeamId = losingTeamCandidates[0];
    }
    if (finalWinningTeamId && finalLosingTeamId) {
      processedGames.push({
        gameId: match.gameId,
        divisionId: match.divisionId,
        draftLink: match.draftLink,
        winningTeamId: finalWinningTeamId,
        losingTeamId: finalLosingTeamId,
        matchData: match.matchData,
      });
    } else {
      console.warn(`[Game Stats Updater] Could not resolve team IDs for match ${match.gameId}.`);
    }
  }
  console.log("[Game Stats Updater] ✅ Completed processing API data.");
  return processedGames;
};

export default processApiGameData;
