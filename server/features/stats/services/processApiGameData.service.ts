import { ApiMatchData } from "./getGameDataFromApi.service";
import { findTeamIdByPlayers, getHistoricalTeamIdsByName } from "../../../db/queries/select";
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
  const teamCandidatesCache = new Map<string, number[]>();
  let fallbackUsedCount = 0;

  const getCandidates = async (teamName: string) => {
    const cached = teamCandidatesCache.get(teamName);
    if (cached) return cached;
    const fetched = await getHistoricalTeamIdsByName(teamName);
    teamCandidatesCache.set(teamName, fetched);
    return fetched;
  };

  for (const match of apiMatches) {
    let usedSheetsFallback = false;
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

    if (winningPlayerPuuids.length !== 5 || losingPlayerPuuids.length !== 5) {
      console.warn(
        `[Game Stats Updater] Unexpected participant split for ${match.gameId}. winners=${winningPlayerPuuids.length}, losers=${losingPlayerPuuids.length}`,
      );
    }

    // Step 3: Determines which team is which and winner/loser
    const [team1Candidates, team2Candidates] = await Promise.all([
      getCandidates(match.team1Name),
      getCandidates(match.team2Name),
    ]);

    if (team1Candidates.length === 0 || team2Candidates.length === 0) {
      console.warn(
        `[Game Stats Updater] Missing team candidates for ${match.gameId}. ${match.team1Name}=${team1Candidates.length}, ${match.team2Name}=${team2Candidates.length}`,
      );
      continue;
    }

    const [team1IsWinnerId, team2IsWinnerId, team1IsLoserId, team2IsLoserId] = await Promise.all([
      findTeamIdByPlayers(winningPlayerPuuids, team1Candidates),
      findTeamIdByPlayers(winningPlayerPuuids, team2Candidates),
      findTeamIdByPlayers(losingPlayerPuuids, team1Candidates),
      findTeamIdByPlayers(losingPlayerPuuids, team2Candidates),
    ]);

    let finalWinningTeamId: number | null = null;
    let finalLosingTeamId: number | null = null;

    const fallbackTeam1 = team1Candidates[0] ?? null;
    const fallbackTeam2 = team2Candidates[0] ?? null;

    // Step 4: Fills in the other winning/losing team ID based on findings
    if (team1IsWinnerId) {
      finalWinningTeamId = team1IsWinnerId;
      finalLosingTeamId = team2IsLoserId || fallbackTeam2;
    } else if (team2IsWinnerId) {
      finalWinningTeamId = team2IsWinnerId;
      finalLosingTeamId = team1IsLoserId || fallbackTeam1;
    } else if (team1IsLoserId) {
      finalLosingTeamId = team1IsLoserId;
      finalWinningTeamId = fallbackTeam2;
    } else if (team2IsLoserId) {
      finalLosingTeamId = team2IsLoserId;
      finalWinningTeamId = fallbackTeam1;
    } else {
      // Last-resort fallback from Sheets (team1Name is sheet winner, team2Name is sheet loser)
      if (fallbackTeam1 && fallbackTeam2 && fallbackTeam1 !== fallbackTeam2) {
        console.warn(
          `[Game Stats Updater] Could not match players to teams for ${match.gameId}. Falling back to Sheets winner/loser mapping.`,
        );
        finalWinningTeamId = fallbackTeam1;
        finalLosingTeamId = fallbackTeam2;
        usedSheetsFallback = true;
        fallbackUsedCount++;
      }
    }

    if (
      finalWinningTeamId !== null &&
      finalLosingTeamId !== null &&
      finalWinningTeamId !== finalLosingTeamId
    ) {
      processedGames.push({
        gameId: match.gameId,
        divisionId: match.divisionId,
        draftLink: match.draftLink,
        winningTeamId: finalWinningTeamId,
        losingTeamId: finalLosingTeamId,
        matchData: match.matchData,
      });
      console.log(
        `[Game Stats Updater] Resolved ${match.gameId}. fallbackUsed=${usedSheetsFallback ? "true" : "false"}`,
      );
    } else {
      console.warn(
        `[Game Stats Updater] Could not resolve team IDs for match ${match.gameId}. winner=${finalWinningTeamId}, loser=${finalLosingTeamId}`,
      );
    }
  }
  console.log(`[Game Stats Updater] Fallback used for ${fallbackUsedCount}/${processedGames.length} processed games.`);
  console.log("[Game Stats Updater] ✅ Completed processing API data.");
  return processedGames;
};

export default processApiGameData;
