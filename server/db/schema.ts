import { serial } from "drizzle-orm/mysql-core";
import { char, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const playersTable = pgTable('players', {
    id: integer('id').primaryKey(),
    primary_riot_puuid: char('primary_riot_puuid').notNull(),
    team_id: integer('team_id'),
    summoner_name: varchar('summoner_name').notNull()
})


export type SelectPlayer =typeof playersTable.$inferSelect