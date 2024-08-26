import { pgTable, foreignKey, unique, serial, integer, bigint, boolean, varchar, timestamp, type AnyPgColumn, index, char, text, uniqueIndex } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const series = pgTable("series", {
	id: serial("id").primaryKey().notNull(),
	team1Id: integer("team1_id").references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
	team2Id: integer("team2_id").references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	messageId: bigint("message_id", { mode: "number" }),
	playoffs: boolean("playoffs").notNull(),
	winCondition: integer("win_condition").notNull(),
	winnerId: integer("winner_id").references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		seriesTeam1IdTeam2IdPlayoffsKey: unique("series_team1_id_team2_id_playoffs_key").on(table.team1Id, table.team2Id, table.playoffs),
	}
});

export const games = pgTable("games", {
	id: serial("id").primaryKey().notNull(),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	winnerId: integer("winner_id").references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
	loserId: integer("loser_id").references(() => teams.id, { onUpdate: "cascade" } ),
	seriesId: integer("series_id").notNull().references(() => series.id, { onDelete: "set null", onUpdate: "cascade" } ),
	resultId: integer("result_id").references(() => results.id, { onDelete: "set null", onUpdate: "cascade" } ),
	gameNum: integer("game_num").default(0).notNull(),
	processed: boolean("processed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const teams = pgTable("teams", {
	id: serial("id").primaryKey().notNull(),
	teamName: varchar("name", { length: 255 }).notNull(),
	divisionId: integer("division_id").references(() => divisions.id, { onDelete: "set null", onUpdate: "cascade" } ),
	groupId: char("group_id", { length: 1 }).notNull(),
	captainId: integer("captain_id").references((): AnyPgColumn => players.id, { onDelete: "set null", onUpdate: "cascade" } ),
	logo: varchar("logo"),
},
(table) => {
	return {
		lowerIdx: index("teams_lower_idx").using("btree", sql`lower((name)::text)`),
	}
});

export const standings = pgTable("standings", {
	id: serial("id").primaryKey().notNull(),
	placement: integer("placement").notNull(),
	divisionId: integer("division_id").notNull(),
	groupId: char("group_id", { length: 1 }).notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const schedules = pgTable("schedules", {
	id: serial("id").primaryKey().notNull(),
	week: integer("week").notNull(),
	divisionId: integer("division_id").notNull().references(() => divisions.id, { onDelete: "set null", onUpdate: "cascade" } ),
	groupId: char("group_id", { length: 1 }).notNull(),
	seriesId: integer("series_id").notNull().references(() => series.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const divisions = pgTable("divisions", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 20 }).notNull(),
	description: text("description"),
	providerId: integer("provider_id").notNull(),
	tournamentId: integer("tournament_id").notNull(),
	groups: integer("groups"),
},
(table) => {
	return {
		lowerIdx: index("divisions_lower_idx").using("btree", sql`lower((name)::text)`),
		divisionsTournamentIdKey: unique("divisions_tournament_id_key").on(table.tournamentId),
	}
});

export const players = pgTable("players", {
	id: serial("id").primaryKey().notNull(),
	primaryRiotPuuid: char("primary_riot_puuid", { length: 78 }).notNull(),
	teamId: integer("team_id").references((): AnyPgColumn => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
	summonerName: varchar("summoner_name", { length: 40 }),
},
(table) => {
	return {
		primaryRiotPuuidIdx: uniqueIndex("players_primary_riot_puuid_idx").using("btree", table.primaryRiotPuuid),
		playersPrimaryRiotPuuidKey: unique("players_primary_riot_puuid_key").on(table.primaryRiotPuuid),
		playersSummonerNameKey: unique("players_summoner_name_key").on(table.summonerName),
	}
});

export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey().notNull(),
	riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
	playerId: integer("player_id").notNull().references(() => players.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	isPrimary: boolean("is_primary").notNull(),
});

export const groupKeys = pgTable("group_keys", {
	id: integer("id").primaryKey().notNull(),
	letter: char("letter", { length: 1 }),
},
(table) => {
	return {
		lowerIdx: index("group_keys_lower_idx").using("btree", sql`lower((letter)::text)`),
	}
});

export const results = pgTable("results", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startTime: bigint("start_time", { mode: "number" }),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	metaData: text("meta_data").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }),
	gameName: varchar("game_name", { length: 60 }),
	gameType: varchar("game_type", { length: 20 }),
	gameMap: integer("game_map"),
	gameMode: varchar("game_mode", { length: 20 }),
	region: varchar("region", { length: 20 }),
},
(table) => {
	return {
		uqShortCode: unique("uq_short_code").on(table.shortCode),
	}
});