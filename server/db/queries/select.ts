import { db } from "../index";
import { playersTable, teamsTable } from "../schema";

export async function getPlayers(): Promise<
  Array<{
    id: Number;
    primaryRiotPuuid: String;
    teamId: Number | null;
    summonerName: String;
  }>
> {
  const allPlayers = db.select().from(playersTable);
  return allPlayers;
}

export async function getTeams(): Promise<
Array<{
  id: number;
  teamName: string;
  divisionId: number;
  groupId: string;
  captainId: number | null;
  logo: string | null;
}>
> {
  const allTeams = db.select().from(teamsTable);
  return allTeams;
}