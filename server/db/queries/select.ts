import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../index";
import {
  asTeams,
  currentSeasonDivisionsInWebsite,
  divisions,
  draftLobbiesInWebsite,
  fearlessDraftLobbiesInWebsite,
  games,
  players,
  playersInWebsite,
  teams,
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
