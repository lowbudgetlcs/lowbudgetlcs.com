import { and, asc, count, desc, eq, gte, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "../index";
import {
  allstarsTeamsInWebsite,
  championListInWebsite,
  currentSeasonDivisionsInWebsite,
  divisionsInWebsite,
  draftLobbiesInWebsite,
  draftUpdatesInWebsite,
  fearlessDraftLobbiesInWebsite,
  matchesInWebsite,
  playersInWebsite,
  playerTeamHistoryInWebsite,
  seasonsInWebsite,
  teamsInWebsite,
} from "../schema";
import { ClientDraftStateProps } from "../../features/draft/models/draftState";
import { FearlessStateClientProps } from "../../features/draft/types/initializerInferfaces";
import { fearlessState } from "../../features/draft/initializers/fearlessLobbyInitializer";

export const getDivisionsForSeason = async () => {
  const divisionsData = await db.select().from(currentSeasonDivisionsInWebsite);
  return divisionsData;
};

export async function getPlayersByPuuid(puuids: string[]) {
  if (puuids.length === 0) {
    return [];
  }
  const players = await db.select().from(playersInWebsite).where(inArray(playersInWebsite.puuid, puuids));
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
      sql`${draftLobbiesInWebsite.blueCode} = ${blueCode} or ${draftLobbiesInWebsite.redCode} = ${redCode}`,
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

  if (!series.totalDrafts) return null;

  const team1FearlessPicks: string[] = [];
  const team2FearlessPicks: string[] = [];
  const team1FearlessBans: string[] = [];
  const team2FearlessBans: string[] = [];

  for (const draft of drafts) {
    const bluePicks = [draft.bPick1, draft.bPick2, draft.bPick3, draft.bPick4, draft.bPick5];
    const redPicks = [draft.rPick1, draft.rPick2, draft.rPick3, draft.rPick4, draft.rPick5];
    const blueBans = [draft.bBan1, draft.bBan2, draft.bBan3, draft.bBan4, draft.bBan5];
    const redBans = [draft.rBan1, draft.rBan2, draft.rBan3, draft.rBan4, draft.rBan5];
    for (const pick of bluePicks) {
      if (!pick) continue;
      if (draft.blueCode === series.team1Code) {
        team1FearlessPicks.push(pick);
      } else if (draft.blueCode === series.team2Code) {
        team2FearlessPicks.push(pick);
      }
    }
    for (const pick of redPicks) {
      if (!pick) continue;
      if (draft.redCode === series.team1Code) {
        team1FearlessPicks.push(pick);
      } else if (draft.redCode === series.team2Code) {
        team2FearlessPicks.push(pick);
      }
    }
    for (const ban of blueBans) {
      if (!ban) continue;
      if (draft.blueCode === series.team1Code) {
        team1FearlessBans.push(ban);
      } else if (draft.blueCode === series.team2Code) {
        team2FearlessBans.push(ban);
      }
    }
    for (const ban of redBans) {
      if (!ban) continue;
      if (draft.redCode === series.team1Code) {
        team1FearlessBans.push(ban);
      } else if (draft.redCode === series.team2Code) {
        team2FearlessBans.push(ban);
      }
    }
  }
  const clientState: FearlessStateClientProps = {
    fearlessCode: series.fearlessCode,
    fearlessComplete: series.fearlessComplete || !fearlessState[series.fearlessCode] ? true : false,
    team1Name: series.team1Name,
    team2Name: series.team2Name,
    draftCount: series.totalDrafts,
    completedDrafts: drafts.length,
    currentDraft: null,
    currentBlueSide: null,
    currentRedSide: null,
    allPicks: [...team1FearlessPicks, ...team2FearlessPicks],
    allBans: [...team1FearlessBans, ...team2FearlessBans],
    team1Picks: team1FearlessPicks,
    team2Picks: team2FearlessPicks,
    team1Bans: team1FearlessBans,
    team2Bans: team2FearlessBans,
    draftLobbyCodes: drafts
      .filter((draft) => draft.draftFinished)
      .map((draft) => draft.lobbyCode),
  };
  return clientState;
}

export async function getAllStarsPosts(seasonId: number) {
  try {
    const posts = await db
      .select()
      .from(allstarsTeamsInWebsite)
      .where(eq(allstarsTeamsInWebsite.seasonId, seasonId));
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
        and(eq(playerTeamHistoryInWebsite.playerPuuid, puuid), isNull(playerTeamHistoryInWebsite.endDate)),
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
      .where(and(eq(playersInWebsite.summonerName, summonerName), eq(playersInWebsite.tagLine, tagLine)));
    if (players.length === 0 || !players[0].puuid) {
      return null;
    }
    return players[0].puuid;
  } catch (err) {
    console.error("Error fetching all playersOneFind: ", err);
    throw new Error("Failed to fetch all players");
  }
};

export async function doesHistoryExist(puuid: string, teamId: number, startDate: Date): Promise<boolean> {
  const formattedStartDate = startDate.toISOString().split("T")[0];

  const result = await db
    .select({ id: playerTeamHistoryInWebsite.id })
    .from(playerTeamHistoryInWebsite)
    .where(
      and(
        eq(playerTeamHistoryInWebsite.playerPuuid, puuid),
        eq(playerTeamHistoryInWebsite.teamId, teamId),
        eq(playerTeamHistoryInWebsite.startDate, formattedStartDate),
      ),
    )
    .limit(1);
  return result.length > 0;
}

export const checkForGameId = async (matchId: string) => {
  try {
    const game = await db.select().from(matchesInWebsite).where(eq(matchesInWebsite.matchId, matchId));
    return game.length > 0;
  } catch (err) {
    console.error("[Game ID Grabber] Error checking for gameId in DB: ", err);
    return false;
  }
};

export const getHistoriesForPlayers = async (puuids: string[]) => {
  if (puuids.length === 0) return [];
  try {
    const histories = await db
      .select()
      .from(playerTeamHistoryInWebsite)
      .where(inArray(playerTeamHistoryInWebsite.playerPuuid, puuids));
    return histories;
  } catch (err) {
    console.error("Error fetching histories for players: ", err);
    return [];
  }
};

export const getAllOpenHistories = async () => {
  try {
    const histories = await db
      .select()
      .from(playerTeamHistoryInWebsite)
      .where(isNull(playerTeamHistoryInWebsite.endDate));
    return histories;
  } catch (err) {
    console.error("Error fetching all open histories: ", err);
    return [];
  }
};

// Bulk fetch existing match IDs from the DB. Returns an array of matchId strings that exist.
export const getExistingMatchIds = async (matchIds: string[]) => {
  if (!matchIds || matchIds.length === 0) return [];
  try {
    const rows = await db
      .select({ matchId: matchesInWebsite.matchId })
      .from(matchesInWebsite)
      .where(inArray(matchesInWebsite.matchId, matchIds));
    return rows.map((r: any) => r.matchId);
  } catch (err) {
    console.error("[Game ID Grabber] Error fetching existing matchIds from DB: ", err);
    return [];
  }
};

export const findTeamIdByPlayers = async (puuids: string[], possibleTeamIds: number[], gameDate?: string) => {
  if (!puuids || puuids.length < 3 || !possibleTeamIds || possibleTeamIds.length === 0) {
    return null;
  }
  try {
    const conditions = [
      inArray(playerTeamHistoryInWebsite.playerPuuid, puuids),
      inArray(playerTeamHistoryInWebsite.teamId, possibleTeamIds),
    ];

    if (gameDate) {
      conditions.push(lte(playerTeamHistoryInWebsite.startDate, gameDate));
      conditions.push(
        or(
          isNull(playerTeamHistoryInWebsite.endDate),
          gte(playerTeamHistoryInWebsite.endDate, gameDate),
        )!
      );
    }

    const result = await db
      .select({
        teamId: playerTeamHistoryInWebsite.teamId,
        matchedPlayers: sql<number>`COUNT(DISTINCT ${playerTeamHistoryInWebsite.playerPuuid})`,
      })
      .from(playerTeamHistoryInWebsite)
      .where(and(...conditions))
      .groupBy(playerTeamHistoryInWebsite.teamId)
      .orderBy(desc(sql`COUNT(DISTINCT ${playerTeamHistoryInWebsite.playerPuuid})`))
      .limit(2);

    if (result.length === 0) {
      return null;
    }

    const bestMatch = Number(result[0].matchedPlayers);
    const secondBestMatch = result.length > 1 ? Number(result[1].matchedPlayers) : -1;

    if (bestMatch < 3) {
      return null;
    }

    if (bestMatch === secondBestMatch) {
      return null;
    }

    return result[0].teamId;
  } catch (error) {
    console.error("[Game Stats Updater] Error in findTeamIdByPlayers:", error);
    return null;
  }
};

export const getTeamIdByName = async (name: string) => {
  try {
    const result = await db
      .select({
        id: teamsInWebsite.id,
      })
      .from(teamsInWebsite)
      .where(eq(teamsInWebsite.teamName, name))
      .orderBy(desc(teamsInWebsite.active), desc(teamsInWebsite.id))
      .limit(1);

    return result.length > 0 ? result[0].id : null;
  } catch (error) {
    console.error("[Game Stats Updater] Error in getTeamIdByName:", error);
    return null;
  }
};
export const getHistoricalTeamIdsByName = async (name: string): Promise<number[]> => {
  try {
    // Uses a recursive CTE to walk the former_team chain in a single query
    const result = await db.execute<{ id: number }>(sql`
      WITH RECURSIVE team_chain AS (
        SELECT id, former_team FROM website.teams WHERE team_name = ${name}
        UNION
        SELECT t.id, t.former_team FROM website.teams t
        INNER JOIN team_chain tc ON t.id = tc.former_team
      )
      SELECT id FROM team_chain
    `);
    return Array.from(result).map((r: any) => r.id as number);
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

export async function getTeamSeasonsByName(teamName: string) {
  try {
    const teamSeasons = await db
      .select({
        teamId: teamsInWebsite.id,
        seasonId: seasonsInWebsite.id,
        seasonName: seasonsInWebsite.seasonName,
        divisionName: divisionsInWebsite.divisionName,
      })
      .from(teamsInWebsite)
      .innerJoin(divisionsInWebsite, eq(teamsInWebsite.divisionId, divisionsInWebsite.id))
      .innerJoin(seasonsInWebsite, eq(divisionsInWebsite.seasonId, seasonsInWebsite.id))
      .where(eq(teamsInWebsite.teamName, teamName))
      .orderBy(desc(seasonsInWebsite.id));

    return teamSeasons;
  } catch (error) {
    console.error("Error in getTeamSeasonsByName:", error);
    return [];
  }
}

export async function getPlayerSeasonsByPuuid(puuid: string) {
  try {
    const playerSeasons = await db
      .select({
        teamId: teamsInWebsite.id,
        seasonId: seasonsInWebsite.id,
        seasonName: seasonsInWebsite.seasonName,
        divisionName: divisionsInWebsite.divisionName,
        teamName: teamsInWebsite.teamName,
      })
      .from(playerTeamHistoryInWebsite)
      .innerJoin(teamsInWebsite, eq(playerTeamHistoryInWebsite.teamId, teamsInWebsite.id))
      .innerJoin(divisionsInWebsite, eq(teamsInWebsite.divisionId, divisionsInWebsite.id))
      .innerJoin(seasonsInWebsite, eq(divisionsInWebsite.seasonId, seasonsInWebsite.id))
      .where(eq(playerTeamHistoryInWebsite.playerPuuid, puuid))
      .orderBy(desc(seasonsInWebsite.id));

    return playerSeasons;
  } catch (error) {
    console.error("Error in getPlayerSeasonsByPuuid:", error);
    return [];
  }
}

export async function getChampionList() {
  try {
    const championList = await db
      .select()
      .from(championListInWebsite)
      .orderBy(asc(championListInWebsite.name));
    // Move "Nothing" or "None" to the start
    const nothingIndex = championList.findIndex(
      (c) => c.name.toLowerCase() === "nothing" || c.name.toLowerCase() === "none" || c.id === -1,
    );

    if (nothingIndex > -1) {
      const nothingChamp = championList.splice(nothingIndex, 1)[0];
      championList.unshift(nothingChamp);
    }
    return championList;
  } catch (error) {
    console.error("Error fetching champion data from DB:", error);
    return [];
  }
}

export const getAllDivisions = async () => {
  try {
    const divisions = await db.select().from(divisionsInWebsite);
    return divisions;
  } catch (err) {
    console.error("Error fetching all divisions: ", err);
    return [];
  }
};

export const getAllSeasons = async () => {
  try {
    const seasons = await db.select().from(seasonsInWebsite).orderBy(asc(seasonsInWebsite.id));
    return seasons;
  } catch (err) {
    console.error("Error fetching all seasons: ", err);
    return [];
  }
};

export const getUpdates = async () => {
  try {
    const updates = await db.select().from(draftUpdatesInWebsite).orderBy(desc(draftUpdatesInWebsite.date));
    return updates;
  } catch (error) {
    console.error("Error fetching updates:", error);
    return [];
  }
};
