import { db } from "../index";
import { divisions, games, players, teams } from "../schema";

export async function getPlayers()
{
  const allPlayers = await db.select().from(players);
  return allPlayers;
}

export async function getTeams(){
  const allTeams = await db.select().from(teams);
  return allTeams;
}

export async function getDivisions(){
  const allDivisions = await db.select().from(divisions);
  return allDivisions;
}

export async function getTournamentCodes() {
  const tournamentCodes = await db.select().from(games);
  return tournamentCodes;
}