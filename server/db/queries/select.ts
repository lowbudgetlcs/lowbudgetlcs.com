import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import {
  divisions,
  games,
  performances,
  playerData,
  players,
  teams,
} from "../schema";
import { error } from "console";

export async function getPlayers() {
  const allPlayers = await db.select().from(players);
  return allPlayers;
}

export async function getTeams() {
  const allTeams = await db.select().from(teams);
  return allTeams;
}

export async function getDivisions() {
  const allDivisions = await db.select().from(divisions);
  return allDivisions;
}

export async function getTournamentCodes() {
  const tournamentCodes = await db.select().from(games);
  return tournamentCodes;
}

export async function getIdFromPerformance(id: number) {
  const performanceStats = await db
    .select({ performanceId: performances.id })
    .from(performances)
    .where(eq(performances.playerId, id));
  return performanceStats;
}

export async function getPlayer(summonerName: string) {
  const player = await db
    .select({ summonerName: players.summonerName, id: players.id })
    .from(players)
    .where(eq(sql`LOWER(${players.summonerName})`, summonerName.toLowerCase()));

  if (player.length < 1) {
    throw new Error("No Player Found");
  }

  return player;
}
export async function getPlayerGameStats(id: number) {
  const gameStats = await db
    .select()
    .from(playerData)
    .where(eq(playerData.performanceId, id));
  return gameStats;
}

export async function getAllGameIDs(id: number) {
  const gameStats = await db
    .select({
      gameId: games.id,
      teamWinId: games.winnerId,
      teamLoseId: games.loserId,
    })
    .from(games)
    .leftJoin(performances, eq(games.id, performances.gameId))
    .where(eq(performances.teamId, id));
  return gameStats;
}
export async function getTeamGameStats(id: number) {
  const gameStats = await db
    .select({
      gameId: games.id,
      playerId: players.id,
      playerName: players.summonerName,
      playerStats: playerData,
    })
    .from(games)
    .leftJoin(performances, eq(games.id, performances.gameId)) // Join games and performances
    .leftJoin(playerData, eq(playerData.performanceId, performances.id)) // Join performances and playerData
    .leftJoin(players, eq(players.id, performances.playerId)) // Join performances and players
    .where(eq(performances.teamId, id)); // Filter by team ID
  return gameStats;
}

// !Uncomment when connecting to DB
// export async function checkDBForURL(blueCode: string, redCode: string, specCode: string) {
//   const matchingURL = await db
//   .select({
//     blueCode: drafts.blueCode,
//     redCode: drafts.redCode,
//     specCode: drafts.specCode
//   })
//   .from(drafts)
//   .where(sql`${drafts.blueCode} = ${blueCode} or ${drafts.redCode} = ${redCode} or ${drafts.specCode} = ${specCode}`)
// }

// Check to see if shortCode exists in game table
export async function getMatchingShortCode(shortCode: string) {
  const matchingCode = await db
    .select({ shortCode: games.shortCode })
    .from(games)
    .where(eq(games.shortCode, shortCode));
  return matchingCode.length > 0
}
