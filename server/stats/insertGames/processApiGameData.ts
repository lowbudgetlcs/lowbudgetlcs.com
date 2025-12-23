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

    // Step 1: Finds the winning team's Riot team ID (100 for blue, 200 for red)
    const winningParticipant = participants.find((p) => p.win);
    if (!winningParticipant) continue; // Skip if match data is inconclusive
    const winningRiotTeamId = winningParticipant.teamId;

    // Step 2: Separates participants into winning and losing player lists by their PUUIDs
    const winningPlayerPuuids = participants
      .filter((p) => p.teamId === winningRiotTeamId)
      .map((p) => p.puuid);
    const losingPlayerPuuids = participants
      .filter((p) => p.teamId !== winningRiotTeamId)
      .map((p) => p.puuid);

    // Step 3: Determines which team is which and winner/loser
    const team1Candidates = await getHistoricalTeamIdsByName(match.team1Name);
    const team2Candidates = await getHistoricalTeamIdsByName(match.team2Name);

    const team1IsWinnerId = await findTeamIdByPlayers(winningPlayerPuuids, team1Candidates);
    const team2IsWinnerId = await findTeamIdByPlayers(winningPlayerPuuids, team2Candidates);

    const team1IsLoserId = await findTeamIdByPlayers(losingPlayerPuuids, team1Candidates);
    const team2IsLoserId = await findTeamIdByPlayers(losingPlayerPuuids, team2Candidates);

    let finalWinningTeamId: number | null = null;
    let finalLosingTeamId: number | null = null;

    // Step 4: Fills in the other winning/losing team ID based on findings
    if (team1IsWinnerId) {
      finalWinningTeamId = team1IsWinnerId;
      finalLosingTeamId = team2IsLoserId || team2Candidates[0];
    } else if (team2IsWinnerId) {
      finalWinningTeamId = team2IsWinnerId;
      finalLosingTeamId = team1IsLoserId || team1Candidates[0];
    } else if (team1IsLoserId) {
      finalLosingTeamId = team1IsLoserId;
      finalWinningTeamId = team2Candidates[0];
    } else if (team2IsLoserId) {
      finalLosingTeamId = team2IsLoserId;
      finalWinningTeamId = team1Candidates[0];
    } else {
      // Fallback in case winner could not be determined. Should never hit this.
      if (team1Candidates.length > 0 && team2Candidates.length > 0) {
        console.warn(
          `[Game Stats Updater] Could not match players to teams for ${match.gameId}. Defaulting to Team 1 (${match.team1Name}) as Winner.`
        );
        finalWinningTeamId = team1Candidates[0];
        finalLosingTeamId = team2Candidates[0];
      }
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
