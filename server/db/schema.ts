import { pgTable, foreignKey, pgEnum, integer, unique, bigint, smallint, text, boolean, jsonb, varchar, serial, type AnyPgColumn, char, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const riftSide = pgEnum("rift_side", ['BLUE', 'RED'])


export const playerPerformances = pgTable("player_performances", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "player_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").references(() => players.id),
	gameId: integer("game_id").references(() => games.id),
	teamId: integer("team_id").references(() => teams.id),
	divisionId: integer("division_id").references(() => divisions.id),
});

export const playerGameData = pgTable("player_game_data", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "player_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerPerformanceId: integer("player_performance_id").references(() => playerPerformances.id),
	kills: integer("kills").default(0).notNull(),
	deaths: integer("deaths").default(0).notNull(),
	assists: integer("assists").default(0).notNull(),
	level: integer("level").default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gold: bigint("gold", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	visionScore: bigint("vision_score", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damage: bigint("damage", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	healing: bigint("healing", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shielding: bigint("shielding", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageTaken: bigint("damage_taken", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	selfMitigatedDamage: bigint("self_mitigated_damage", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageToTurrets: bigint("damage_to_turrets", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	longestLife: bigint("longest_life", { mode: "number" }).default(0).notNull(),
	doubleKills: smallint("double_kills").default(0).notNull(),
	tripleKills: smallint("triple_kills").default(0).notNull(),
	quadraKills: smallint("quadra_kills").default(0).notNull(),
	pentaKills: smallint("penta_kills").default(0).notNull(),
	cs: integer("cs").default(0).notNull(),
	championName: text("champion_name").notNull(),
	item0: integer("item0"),
	item1: integer("item1"),
	item2: integer("item2"),
	item3: integer("item3"),
	item4: integer("item4"),
	item5: integer("item5"),
	trinket: integer("trinket"),
	keystoneRune: integer("keystone_rune").notNull(),
	secondaryTree: integer("secondary_tree").notNull(),
	summoner1: integer("summoner1").notNull(),
	summoner2: integer("summoner2").notNull(),
},
(table) => {
	return {
		playerGameDataPlayerPerformanceIdKey: unique("player_game_data_player_performance_id_key").on(table.playerPerformanceId),
	}
});

export const teamPerformances = pgTable("team_performances", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "team_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamId: integer("team_id").references(() => teams.id),
	gameId: integer("game_id").references(() => games.id),
	divisionId: integer("division_id").references(() => divisions.id),
});

export const teamGameData = pgTable("team_game_data", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "team_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamPerformanceId: integer("team_performance_id").references(() => teamPerformances.id),
	gold: integer("gold").notNull(),
	kills: integer("kills").notNull(),
	side: riftSide("side").notNull(),
	win: boolean("win").notNull(),
	gameLength: integer("game_length").notNull(),
	barons: integer("barons").default(0).notNull(),
	dragons: integer("dragons").default(0).notNull(),
	grubs: integer("grubs").default(0).notNull(),
	heralds: integer("heralds").default(0).notNull(),
	towers: integer("towers").default(0).notNull(),
	inhibitors: integer("inhibitors").default(0).notNull(),
	firstbaron: boolean("firstbaron").default(false).notNull(),
	firstdragon: boolean("firstdragon").default(false).notNull(),
	firstgrub: boolean("firstgrub").default(false).notNull(),
	firstherald: boolean("firstherald").default(false).notNull(),
	firsttower: boolean("firsttower").default(false).notNull(),
	firstinhibitor: boolean("firstinhibitor").default(false).notNull(),
	firstblood: boolean("firstblood").default(false).notNull(),
},
(table) => {
	return {
		teamGameDataTeamPerformanceIdKey: unique("team_game_data_team_performance_id_key").on(table.teamPerformanceId),
	}
});

export const gameDumps = pgTable("game_dumps", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "game_dumps_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	gameId: integer("game_id").references(() => games.id),
	dump: jsonb("dump").notNull(),
},
(table) => {
	return {
		gameDumpsGameIdKey: unique("game_dumps_game_id_key").on(table.gameId),
	}
});

export const draftLobbies = pgTable("draft_lobbies", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "draft_lobbies_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shortcode: varchar("shortcode").references(() => games.shortcode),
	bluecode: varchar("bluecode", { length: 50 }).notNull(),
	redcode: varchar("redcode", { length: 50 }).notNull(),
	lobbycode: varchar("lobbycode", { length: 50 }).notNull(),
	redname: varchar("redname", { length: 50 }).notNull(),
	bluename: varchar("bluename", { length: 50 }).notNull(),
	bpick1: varchar("bpick1", { length: 25 }),
	bpick2: varchar("bpick2", { length: 25 }),
	bpick3: varchar("bpick3", { length: 25 }),
	bpick4: varchar("bpick4", { length: 25 }),
	bpick5: varchar("bpick5", { length: 25 }),
	rpick1: varchar("rpick1", { length: 25 }),
	rpick2: varchar("rpick2", { length: 25 }),
	rpick3: varchar("rpick3", { length: 25 }),
	rpick4: varchar("rpick4", { length: 25 }),
	rpick5: varchar("rpick5", { length: 25 }),
	bban1: varchar("bban1", { length: 25 }),
	bban2: varchar("bban2", { length: 25 }),
	bban3: varchar("bban3", { length: 25 }),
	bban4: varchar("bban4", { length: 25 }),
	bban5: varchar("bban5", { length: 25 }),
	rban1: varchar("rban1", { length: 25 }),
	rban2: varchar("rban2", { length: 25 }),
	rban3: varchar("rban3", { length: 25 }),
	rban4: varchar("rban4", { length: 25 }),
	rban5: varchar("rban5", { length: 25 }),
},
(table) => {
	return {
		draftLobbiesShortcodeKey: unique("draft_lobbies_shortcode_key").on(table.shortcode),
	}
});

export const meta = pgTable("meta", {
	id: integer("id").primaryKey().notNull(),
	seasonName: varchar("season_name", { length: 20 }).notNull(),
	providerId: integer("provider_id"),
});

export const divisions = pgTable("divisions", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 20 }),
	tournamentId: integer("tournament_id"),
	teamCount: integer("team_count"),
},
(table) => {
	return {
		divisionsNameKey: unique("divisions_name_key").on(table.name),
	}
});

export const players = pgTable("players", {
	id: serial("id").primaryKey().notNull(),
	riotPuuid: char("riot_puuid", { length: 78 }),
	summonerName: varchar("summoner_name", { length: 25 }),
	teamId: integer("team_id").references((): AnyPgColumn => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		playersRiotPuuidKey: unique("players_riot_puuid_key").on(table.riotPuuid),
	}
});

export const teams = pgTable("teams", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 100 }),
	logo: text("logo"),
	captainId: integer("captain_id").references((): AnyPgColumn => players.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	divisionId: integer("division_id").references(() => divisions.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const games = pgTable("games", {
	id: serial("id").primaryKey().notNull(),
	shortcode: varchar("shortcode", { length: 100 }).notNull(),
	gameNum: integer("game_num").notNull(),
	winnerId: integer("winner_id").references(() => teams.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	loserId: integer("loser_id").references(() => teams.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	callbackResult: jsonb("callback_result"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	seriesId: integer("series_id").notNull().references(() => series.id),
},
(table) => {
	return {
		gamesShortcodeKey: unique("games_shortcode_key").on(table.shortcode),
	}
});

export const series = pgTable("series", {
	id: serial("id").primaryKey().notNull(),
	divisionId: integer("division_id").notNull().references(() => divisions.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	winnerId: integer("winner_id").references(() => teams.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	loserId: integer("loser_id").references(() => teams.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	playoffs: boolean("playoffs").default(false),
});

export const teamToSeries = pgTable("team_to_series", {
	id: serial("id").primaryKey().notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "set null", onUpdate: "cascade" } ),
});