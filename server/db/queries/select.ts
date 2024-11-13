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
