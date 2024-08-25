import {db} from '../index'
import { playersTable, SelectPlayer } from '../schema'

export async function getPlayers(): Promise<
Array<{
    id: Number;
    primary_riot_puuid: String;
    team_id: Number | null;
    summoner_name: String;
}>
> {
    return db.select().from(playersTable)
}
