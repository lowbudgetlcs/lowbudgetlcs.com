import { pgTable, pgEnum, integer, varchar, unique, serial, type AnyPgColumn, foreignKey, char, text, jsonb, timestamp, boolean, bigint, smallint } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const riftSide = pgEnum("rift_side", ['BLUE', 'RED'])


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
	teamId: integer("team_id").references((): AnyPgColumn => teams.id, { onDelete: "set null" } ),
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
	captainId: integer("captain_id").references((): AnyPgColumn => players.id),
	divisionId: integer("division_id").references(() => divisions.id),
});

export const games = pgTable("games", {
	id: serial("id").primaryKey().notNull(),
	shortcode: varchar("shortcode", { length: 100 }).notNull(),
	gameNum: integer("game_num").notNull(),
	winnerId: integer("winner_id").references(() => teams.id),
	loserId: integer("loser_id").references(() => teams.id),
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
	divisionId: integer("division_id").notNull().references(() => divisions.id),
	winnerId: integer("winner_id").references(() => teams.id),
	loserId: integer("loser_id").references(() => teams.id),
	playoffs: boolean("playoffs").default(false).notNull(),
});

export const teamToSeries = pgTable("team_to_series", {
	id: serial("id").primaryKey().notNull(),
	teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "set null" } ),
});

export const playerPerformances = pgTable("player_performances", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "player_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull().references(() => players.id),
	gameId: integer("game_id").notNull().references(() => games.id),
	teamId: integer("team_id").notNull().references(() => teams.id),
	divisionId: integer("division_id").notNull().references(() => divisions.id),
},
(table) => {
	return {
		playerPerformancesGameIdKey: unique("player_performances_game_id_key").on(table.gameId),
	}
});

export const teamPerformances = pgTable("team_performances", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "team_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamId: integer("team_id").references(() => teams.id),
	gameId: integer("game_id").references(() => games.id),
	divisionId: integer("division_id").references(() => divisions.id),
},
(table) => {
	return {
		teamPerformancesGameIdKey: unique("team_performances_game_id_key").on(table.gameId),
	}
});

export const teamGameData = pgTable("team_game_data", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "team_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamPerformanceId: integer("team_performance_id").notNull().references(() => teamPerformances.id),
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
	firstBaron: boolean("first_baron").default(false).notNull(),
	firstDragon: boolean("first_dragon").default(false).notNull(),
	firstGrub: boolean("first_grub").default(false).notNull(),
	firstHerald: boolean("first_herald").default(false).notNull(),
	firstTower: boolean("first_tower").default(false).notNull(),
	firstInhibitor: boolean("first_inhibitor").default(false).notNull(),
	firstBlood: boolean("first_blood").default(false).notNull(),
},
(table) => {
	return {
		teamGameDataTeamPerformanceIdKey: unique("team_game_data_team_performance_id_key").on(table.teamPerformanceId),
	}
});

export const playerGameData = pgTable("player_game_data", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: "player_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerPerformanceId: integer("player_performance_id").notNull().references(() => playerPerformances.id),
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
	championName: varchar("champion_name", { length: 25 }).notNull(),
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
	blueCode: varchar("blue_code", { length: 50 }).notNull(),
	redCode: varchar("red_code", { length: 50 }).notNull(),
	lobbyCode: varchar("lobby_code", { length: 50 }).notNull(),
	redName: varchar("red_name", { length: 50 }).notNull(),
	blueName: varchar("blue_name", { length: 50 }).notNull(),
	bPick1: varchar("b_pick_1", { length: 25 }),
	bPick2: varchar("b_pick_2", { length: 25 }),
	bPick3: varchar("b_pick_3", { length: 25 }),
	bPick4: varchar("b_pick_4", { length: 25 }),
	bPick5: varchar("b_pick_5", { length: 25 }),
	rPick1: varchar("r_pick_1", { length: 25 }),
	rPick2: varchar("r_pick_2", { length: 25 }),
	rPick3: varchar("r_pick_3", { length: 25 }),
	rPick4: varchar("r_pick_4", { length: 25 }),
	rPick5: varchar("r_pick_5", { length: 25 }),
	bBan1: varchar("b_ban_1", { length: 25 }),
	bBan2: varchar("b_ban_2", { length: 25 }),
	bBan3: varchar("b_ban_3", { length: 25 }),
	bBan4: varchar("b_ban_4", { length: 25 }),
	bBan5: varchar("b_ban_5", { length: 25 }),
	rBan1: varchar("r_ban_1", { length: 25 }),
	rBan2: varchar("r_ban_2", { length: 25 }),
	rBan3: varchar("r_ban_3", { length: 25 }),
	rBan4: varchar("r_ban_4", { length: 25 }),
	rBan5: varchar("r_ban_5", { length: 25 }),
},
(table) => {
	return {
		draftLobbiesShortcodeKey: unique("draft_lobbies_shortcode_key").on(table.shortcode),
	}
});