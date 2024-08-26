import { char, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const playersTable = pgTable("players", {
  id: integer("id").primaryKey(),
  primary_riot_puuid: char("primary_riot_puuid").notNull(),
  team_id: integer("team_id"),
  summoner_name: varchar("summoner_name").notNull(),
});

export const teamsTable = pgTable("teams", {
  id: integer("id").primaryKey(),
  teamName: varchar("name").notNull(),
  division: integer("division").notNull(),
  groupId: char("group_id").notNull(),
  captainID: integer("captain_id"),
  logo: varchar("logo"),
});

export type SelectPlayer = typeof playersTable.$inferSelect;

export type SelectTeam = typeof teamsTable.$inferSelect;
