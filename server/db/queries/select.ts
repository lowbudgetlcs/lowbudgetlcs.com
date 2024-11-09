import { eq } from "drizzle-orm";
import { db } from "../index";
import { divisions, games, performances, players, teams } from "../schema";

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
