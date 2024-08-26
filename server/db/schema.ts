import { char, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const playersTable = pgTable("players", {
  id: integer("id").primaryKey(),
  primaryRiotPuuid: char("primary_riot_puuid").notNull(),
  teamId: integer("team_id"),
  summonerName: varchar("summoner_name").notNull(),
});

export const teamsTable = pgTable("teams", {
  id: integer("id").primaryKey(),
  teamName: varchar("name").notNull(),
  divisionId: integer("division_id").notNull(),
  groupId: char("group_id").notNull(),
  captainId: integer("captain_id"),
  logo: varchar("logo"),
});

export type SelectPlayer = typeof playersTable.$inferSelect;

export type SelectTeam = typeof teamsTable.$inferSelect;
