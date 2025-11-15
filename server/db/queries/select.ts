import { and, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../index";
import {
  asTeams,
  currentSeasonDivisionsInWebsite,
  divisions,
  divisionsInWebsite,
  draftLobbiesInWebsite,
  fearlessDraftLobbiesInWebsite,
  games,
  matchesInWebsite,
  players,
  playersInWebsite,
  playerTeamHistoryInWebsite,
  teams,
  teamsInWebsite,
} from "../schema";
import { ClientDraftStateProps } from "../../draftTool/states/draftState";
import { FearlessStateClientProps } from "../../draftTool/interfaces/initializerInferfaces";

export const getDivisionsForSeason = async () => {
  const divisionsData = await db.select().from(currentSeasonDivisionsInWebsite);
  return divisionsData;
};

export async function getTournamentCodes() {
  const tournamentCodes = await db.select().from(games);
  return tournamentCodes;
}

export async function getPlayersByPuuid(puuids: string[]) {
  if (puuids.length === 0) {
    return [];
  }
  const players = await db
    .select()
    .from(playersInWebsite)
    .where(inArray(playersInWebsite.puuid, puuids));
  return players;
}

export async function checkDBForURL(blueCode: string, redCode: string) {
  const matchingURL = await db
    .select({
      blueCode: draftLobbiesInWebsite.blueCode,
      redCode: draftLobbiesInWebsite.redCode,
    })
    .from(draftLobbiesInWebsite)
    .where(
      sql`${draftLobbiesInWebsite.blueCode} = ${blueCode} or ${draftLobbiesInWebsite.redCode} = ${redCode}`
    );
  return matchingURL;
}

export async function checkDBForFearlessCode(fearlessCode: string) {
  const matchingURL = await db
    .select({
      fearlessCode: fearlessDraftLobbiesInWebsite.fearlessCode,
    })
    .from(fearlessDraftLobbiesInWebsite)
    .where(eq(fearlessDraftLobbiesInWebsite.fearlessCode, fearlessCode));
  if (matchingURL.length > 0) {
    return false;
  } else {
    return true;
  }
}
// Check to see if shortCode exists in game table
export async function getMatchingShortCode(shortCode: string) {
  try {
    const matchingCode = await db
      .select({ shortCode: games.shortcode })
      .from(games)
      .where(eq(games.shortcode, shortCode));
    const checkDupes = await checkDuplicateShortCode(shortCode);
    if (checkDupes) {
      return false;
    } else {
      return matchingCode.length > 0;
    }
  } catch (err) {
    console.error("Error checking tournamentID with server: ", err);
    throw new Error("Failed to check tournamentID");
  }
}

export async function checkDuplicateShortCode(shortCode: string) {
  try {
    const matchingCode = await db
      .select({ shortCode: draftLobbiesInWebsite.shortcode })
      .from(draftLobbiesInWebsite)
      .where(eq(draftLobbiesInWebsite.shortcode, shortCode));
    return matchingCode.length > 0;
  } catch (err) {
    console.error("Error checking tournamentID with server: ", err);
    throw new Error("Failed to check tournamentID");
  }
}

export async function getLobbyCodes(lobbyCode: string) {
  const matchingCodes = await db
    .select({
      lobbyCode: draftLobbiesInWebsite.lobbyCode,
      redCode: draftLobbiesInWebsite.redCode,
      blueCode: draftLobbiesInWebsite.blueCode,
    })
    .from(draftLobbiesInWebsite)
    .where(eq(draftLobbiesInWebsite.lobbyCode, lobbyCode));
  return matchingCodes.length > 0 ? matchingCodes[0] : null;
}

// Finds valid past draft and returns it in the client state form
export async function getPastDraft(lobbyCode: string) {
  const result = await db
    .select()
    .from(draftLobbiesInWebsite)
    .where(eq(draftLobbiesInWebsite.lobbyCode, lobbyCode));

  const draft = result[0];

  if (draft) {
    const draftFinished = draft.draftFinished;
    const clientState: ClientDraftStateProps = {
      draftStarted: false,
      activePhase: "finished",
      phaseType: null,
      blueDisplayName: draft.blueName,
      redDisplayName: draft.redName,
      blueReady: true,
      redReady: true,
      timer: 30,
      bansArray: [],
      picksArray: [],
      bluePicks: [
        draft.bPick1 || "nothing",
        draft.bPick2 || "nothing",
        draft.bPick3 || "nothing",
        draft.bPick4 || "nothing",
        draft.bPick5 || "nothing",
      ],
      redPicks: [
        draft.rPick1 || "nothing",
        draft.rPick2 || "nothing",
        draft.rPick3 || "nothing",
        draft.rPick4 || "nothing",
        draft.rPick5 || "nothing",
      ],
      blueBans: [
        draft.bBan1 || "nothing",
        draft.bBan2 || "nothing",
        draft.bBan3 || "nothing",
        draft.bBan4 || "nothing",
        draft.bBan5 || "nothing",
      ],
      redBans: [
        draft.rBan1 || "nothing",
        draft.rBan2 || "nothing",
        draft.rBan3 || "nothing",
        draft.rBan4 || "nothing",
        draft.rBan5 || "nothing",
      ],
      banIndex: 0,
      pickIndex: 0,
      currentTurn: "",
      currentBluePick: 0,
      currentRedPick: 0,
      currentBlueBan: 0,
      currentRedBan: 0,
      displayTurn: null,
      currentHover: null,
      bluePick: null,
      redPick: null,
      draftComplete: true,
      fearlessCode: draft.fearlessCode || undefined,
    };

    return { clientState, draftFinished };
  }

  return null;
}

// Finds valid past fearless series and returns it in the client state form
export async function getPastFearlessSeries(fearlessCode: string) {
  const seriesResult = await db
    .select()
    .from(fearlessDraftLobbiesInWebsite)
    .where(eq(fearlessDraftLobbiesInWebsite.fearlessCode, fearlessCode))
    .limit(1);

  if (!seriesResult.length) {
    return null;
  }

  const series = seriesResult[0];
  const drafts = await db
    .select()
    .from(draftLobbiesInWebsite)
    .where(eq(draftLobbiesInWebsite.fearlessCode, fearlessCode));

  if (!series.fearlessComplete || !series.totalDrafts) return;

  const clientState: FearlessStateClientProps = {
    fearlessCode: series.fearlessCode,
    fearlessComplete: series.fearlessComplete,
    team1Name: series.team1Name,
    team2Name: series.team2Name,
    draftCount: series.totalDrafts,
    completedDrafts: drafts.length,
    currentDraft: null,
    currentBlueSide: null,
    currentRedSide: null,
    allPicks: [],
    allBans: [],
    draftLobbyCodes: drafts.map((draft) => draft.lobbyCode),
  };
  return clientState;
}

export async function getAllStarsPosts(seasonId: number) {
  try {
    const posts = await db.select().from(asTeams).where(eq(asTeams.seasonId, seasonId));
    return posts;
  } catch (err) {
    console.error("Error fetching roster data: ", err);
    throw new Error("Failed to fetch roster data");
  }
}

export const getSelectTeams = async (teamNamesFromSheet: string[]) => {
  try {
    const teams = await db
      .select()
      .from(teamsInWebsite)
      .where(inArray(teamsInWebsite.teamName, teamNamesFromSheet));
    return teams;
  } catch (err) {
    console.error("Error fetching all teams in select: ", err);
    throw new Error("Failed to fetch all SELECTED teams");
  }
};

export const getAllTeams = async () => {
  try {
    const teams = await db.select().from(teamsInWebsite);
    return teams;
  } catch (err) {
    console.error("Error fetching all teams in select: ", err);
    throw new Error("Failed to fetch all teams");
  }
};

export const findOpenHistoryForPlayer = async (puuid: string) => {
  try {
    const history = await db
      .select()
      .from(playerTeamHistoryInWebsite)
      .where(
        and(
          eq(playerTeamHistoryInWebsite.playerPuuid, puuid),
          isNull(playerTeamHistoryInWebsite.endDate)
        )
      )
      .orderBy(desc(playerTeamHistoryInWebsite.startDate))
      .limit(1);
    return history.length > 0 ? history[0] : null;
  } catch (err) {
    console.error("Error finding open history for player: ", err);
    throw new Error("Failed to find open history for player");
  }
};

export const getAllPlayers = async () => {
  try {
    const players = await db.select().from(playersInWebsite);
    return players;
  } catch (err) {
    console.error("Error fetching all players: ", err);
    throw new Error("Failed to fetch all players");
  }
};

export const getPlayerByName = async (summonerName: string, tagLine: string) => {
  try {
    const players = await db
      .select({
        puuid: playersInWebsite.puuid,
      })
      .from(playersInWebsite)
      .where(
        and(eq(playersInWebsite.summonerName, summonerName), eq(playersInWebsite.tagLine, tagLine))
      );
    if (players.length === 0 || !players[0].puuid) {
      return null;
    }
    return players[0].puuid;
  } catch (err) {
    console.error("Error fetching all playersOneFind: ", err);
    throw new Error("Failed to fetch all players");
  }
};

export async function doesHistoryExist(
  puuid: string,
  teamId: number,
  startDate: Date
): Promise<boolean> {
  const formattedStartDate = startDate.toISOString().split("T")[0];

  const result = await db
    .select({ id: playerTeamHistoryInWebsite.id })
    .from(playerTeamHistoryInWebsite)
    .where(
      and(
        eq(playerTeamHistoryInWebsite.playerPuuid, puuid),
        eq(playerTeamHistoryInWebsite.teamId, teamId),
        eq(playerTeamHistoryInWebsite.startDate, formattedStartDate)
      )
    )
    .limit(1);
  return result.length > 0;
}

export const checkForGameId = async (matchId: string) => {
  try {
    const game = await db
      .select()
      .from(matchesInWebsite)
      .where(eq(matchesInWebsite.matchId, matchId));
    return game.length > 0;
  } catch (err) {
    console.error("[Game ID Grabber] Error checking for gameId in DB: ", err);
    return false;
  }
};

export const findTeamIdByPlayers = async (puuids: string[], possibleTeamIds: number[]) => {
  if (!puuids || puuids.length < 3 || !possibleTeamIds || possibleTeamIds.length === 0) {
    return null;
  }
  try {
    const result = await db
      .select({ teamId: playerTeamHistoryInWebsite.teamId })
      .from(playerTeamHistoryInWebsite)
      .where(
        and(
          inArray(playerTeamHistoryInWebsite.playerPuuid, puuids),
          inArray(playerTeamHistoryInWebsite.teamId, possibleTeamIds)
        )
      )
      .groupBy(playerTeamHistoryInWebsite.teamId)
      .orderBy(desc(sql`COUNT(DISTINCT ${playerTeamHistoryInWebsite.playerPuuid})`))
      .limit(1);

    return result.length > 0 ? result[0].teamId : null;
  } catch (error) {
    console.error("[Game Stats Updater] Error in findTeamIdByPlayers:", error);
    return null;
  }
};

export const getTeamIdByName = async (name: string) => {
  try {
    const result = await db
      .select({
        id: teams.id,
      })
      .from(teamsInWebsite)
      .where(and(eq(teamsInWebsite.teamName, name), eq(teamsInWebsite.active, true)))
      .limit(1);

    return result.length > 0 ? result[0].id : null;
  } catch (error) {
    console.error("[Game Stats Updater] Error in getTeamIdByName:", error);
    return null;
  }
};
export const getHistoricalTeamIdsByName = async (name: string): Promise<number[]> => {
  const historicalIds: number[] = [];
  const visitedIds = new Set<number>();
  let currentTeamName: string | null = name;
  let nextFormerTeamId: number | null = null;

  const maxIterations = 100; // Safety limit
  let iterations = 0;

  try {
    // First, find the starting team by its name
    const initialTeam = await db
      .select({
        id: teamsInWebsite.id,
        formerTeamId: teamsInWebsite.formerTeam,
      })
      .from(teamsInWebsite)
      .where(eq(teamsInWebsite.teamName, currentTeamName))
      .limit(1);

    if (initialTeam.length === 0) {
      return []; // No team found with that name
    }

    historicalIds.push(initialTeam[0].id);
    visitedIds.add(initialTeam[0].id);
    nextFormerTeamId = initialTeam[0].formerTeamId;

    // Iteratively walk down the 'former_team' chain
    while (nextFormerTeamId && iterations < maxIterations) {
      // Cycle detection
      if (visitedIds.has(nextFormerTeamId)) {
        console.warn("[Game Stats Updater] Cycle detected in former_team chain");
        break;
      }
      iterations++;

      const formerTeam = await db
        .select({
          id: teamsInWebsite.id,
          formerTeamId: teamsInWebsite.formerTeam,
        })
        .from(teamsInWebsite)
        .where(eq(teamsInWebsite.id, nextFormerTeamId))
        .limit(1);

      if (formerTeam.length > 0) {
        historicalIds.push(formerTeam[0].id);
        visitedIds.add(formerTeam[0].id);
        nextFormerTeamId = formerTeam[0].formerTeamId;
      } else {
        // No more former teams in the chain
        nextFormerTeamId = null;
      }
    }

    return historicalIds;
  } catch (error) {
    console.error("[Game Stats Updater] Error in getHistoricalTeamIdsByName:", error);
    return [];
  }
};

export const getDivisionsForSelectedSeason = async (seasonId: number) => {
  try {
    const divisionsData = await db
      .select()
      .from(divisionsInWebsite)
      .where(eq(divisionsInWebsite.seasonId, seasonId));
    return divisionsData;
  } catch (error) {
    console.error("Error in getDivisionsForSelectedSeason:", error);
    return [];
  }

};