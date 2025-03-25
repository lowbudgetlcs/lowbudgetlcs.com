import { pgTable, integer, text, unique, serial, varchar, type AnyPgColumn, index, foreignKey, char, jsonb, timestamp, boolean, bigint, smallint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const meta = pgTable("meta", {
	id: integer().primaryKey().notNull(),
	seasonName: text("season_name").notNull(),
	providerId: integer("provider_id").notNull(),
});

export const divisions = pgTable("divisions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	tournamentId: integer("tournament_id").notNull(),
}, (table) => [
	unique("divisions_name_key").on(table.name),
]);

export const commandRolePermissions = pgTable("command_role_permissions", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	roleId: text("role_id").notNull(),
});

export const commandChannelPermissions = pgTable("command_channel_permissions", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	channelId: text("channel_id").notNull(),
});

export const players = pgTable("players", {
	id: serial().primaryKey().notNull(),
	riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
	summonerName: text("summoner_name").notNull(),
	teamId: integer("team_id"),
}, (table) => [
	index("players_summoner_name_idx").using("btree", table.summonerName.asc().nullsLast().op("text_ops")),
	unique("players_riot_puuid_key").on(table.riotPuuid),
]);

export const teams = pgTable("teams", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	logo: text(),
	captainId: integer("captain_id"),
	divisionId: integer("division_id"),
}, (table) => [
	index("teams_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.captainId],
			foreignColumns: [players.id],
			name: "fk_captain_id"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "fk_division_id"
		}),
]);

export const games = pgTable("games", {
	id: serial().primaryKey().notNull(),
	shortcode: text().notNull(),
	gameNum: integer("game_num").notNull(),
	winnerId: integer("winner_id"),
	loserId: integer("loser_id"),
	callbackResult: jsonb("callback_result"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	seriesId: integer("series_id"),
}, (table) => [
	index("games_loser_id_idx").using("btree", table.loserId.asc().nullsLast().op("int4_ops")),
	index("games_series_id_idx").using("btree", table.seriesId.asc().nullsLast().op("int4_ops")),
	index("games_winner_id_idx").using("btree", table.winnerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.loserId],
			foreignColumns: [teams.id],
			name: "fk_loser_id"
		}),
	foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "fk_series_id"
		}),
	foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "fk_winner_id"
		}),
	unique("games_shortcode_key").on(table.shortcode),
]);

export const series = pgTable("series", {
	id: serial().primaryKey().notNull(),
	divisionId: integer("division_id").notNull(),
	winnerId: integer("winner_id"),
	loserId: integer("loser_id"),
}, (table) => [
	index("series_loser_id_idx").using("btree", table.loserId.asc().nullsLast().op("int4_ops")),
	index("series_winner_id_idx").using("btree", table.winnerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "fk_division_id"
		}),
	foreignKey({
			columns: [table.loserId],
			foreignColumns: [teams.id],
			name: "fk_loser_id"
		}),
	foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "fk_winner_id"
		}),
]);

export const teamToSeries = pgTable("team_to_series", {
	id: serial().primaryKey().notNull(),
	teamId: integer("team_id").notNull(),
	seriesId: integer("series_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "fk_series_id"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "fk_team_id"
		}),
]);

export const playerPerformances = pgTable("player_performances", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "player_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerId: integer("player_id").notNull(),
	gameId: integer("game_id").notNull(),
	teamId: integer("team_id").notNull(),
	divisionId: integer("division_id").notNull(),
}, (table) => [
	index("player_performances_division_id_idx").using("btree", table.divisionId.asc().nullsLast().op("int4_ops")),
	index("player_performances_game_id_idx").using("btree", table.gameId.asc().nullsLast().op("int4_ops")),
	index("player_performances_player_id_idx").using("btree", table.playerId.asc().nullsLast().op("int4_ops")),
	index("player_performances_team_id_idx").using("btree", table.teamId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "player_performances_division_id_fkey"
		}),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "player_performances_game_id_fkey"
		}),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "player_performances_player_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "player_performances_team_id_fkey"
		}),
	unique("player_performances_player_id_game_id_key").on(table.playerId, table.gameId),
]);

export const teamPerformances = pgTable("team_performances", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "team_performances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamId: integer("team_id"),
	gameId: integer("game_id"),
	divisionId: integer("division_id"),
}, (table) => [
	index("team_performances_division_id_idx").using("btree", table.divisionId.asc().nullsLast().op("int4_ops")),
	index("team_performances_division_id_idx1").using("btree", table.divisionId.asc().nullsLast().op("int4_ops")),
	index("team_performances_game_id_idx").using("btree", table.gameId.asc().nullsLast().op("int4_ops")),
	index("team_performances_team_id_idx").using("btree", table.teamId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "team_performances_division_id_fkey"
		}),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "team_performances_game_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "team_performances_team_id_fkey"
		}),
	unique("team_performances_team_id_game_id_key").on(table.teamId, table.gameId),
]);

export const teamGameData = pgTable("team_game_data", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "team_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	teamPerformanceId: integer("team_performance_id").notNull(),
	win: boolean().notNull(),
	side: text().notNull(),
	gold: integer().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameLength: bigint("game_length", { mode: "number" }).notNull(),
	kills: integer().notNull(),
	barons: integer().default(0).notNull(),
	dragons: integer().default(0).notNull(),
	grubs: integer().default(0).notNull(),
	heralds: integer().default(0).notNull(),
	towers: integer().default(0).notNull(),
	inhibitors: integer().default(0).notNull(),
	firstBaron: boolean("first_baron").default(false).notNull(),
	firstDragon: boolean("first_dragon").default(false).notNull(),
	firstGrub: boolean("first_grub").default(false).notNull(),
	firstHerald: boolean("first_herald").default(false).notNull(),
	firstTower: boolean("first_tower").default(false).notNull(),
	firstInhibitor: boolean("first_inhibitor").default(false).notNull(),
	firstBlood: boolean("first_blood").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamPerformanceId],
			foreignColumns: [teamPerformances.id],
			name: "team_game_data_team_performance_id_fkey"
		}),
	unique("team_game_data_team_performance_id_key").on(table.teamPerformanceId),
]);

export const playerGameData = pgTable("player_game_data", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "player_game_data_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playerPerformanceId: integer("player_performance_id").notNull(),
	kills: integer().default(0).notNull(),
	deaths: integer().default(0).notNull(),
	assists: integer().default(0).notNull(),
	level: integer().default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gold: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	visionScore: bigint("vision_score", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damage: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	healing: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shielding: bigint({ mode: "number" }).default(0).notNull(),
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
	cs: integer().default(0).notNull(),
	championName: varchar("champion_name", { length: 25 }).notNull(),
	item0: integer(),
	item1: integer(),
	item2: integer(),
	item3: integer(),
	item4: integer(),
	item5: integer(),
	trinket: integer(),
	keystoneRune: integer("keystone_rune").notNull(),
	secondaryTree: integer("secondary_tree").notNull(),
	summoner1: integer().notNull(),
	summoner2: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerPerformanceId],
			foreignColumns: [playerPerformances.id],
			name: "player_game_data_player_performance_id_fkey"
		}),
	unique("player_game_data_player_performance_id_key").on(table.playerPerformanceId),
]);

export const gameDumps = pgTable("game_dumps", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "game_dumps_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	gameId: integer("game_id").notNull(),
	dump: jsonb().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "game_dumps_game_id_fkey"
		}),
	unique("game_dumps_game_id_key").on(table.gameId),
]);

export const draftLobbies = pgTable("draft_lobbies", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "draft_lobbies_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shortcode: varchar(),
	blueCode: text("blue_code").notNull(),
	redCode: text("red_code").notNull(),
	lobbyCode: text("lobby_code").notNull(),
	redName: text("red_name").notNull(),
	blueName: text("blue_name").notNull(),
	bPick1: text("b_pick_1"),
	bPick2: text("b_pick_2"),
	bPick3: text("b_pick_3"),
	bPick4: text("b_pick_4"),
	bPick5: text("b_pick_5"),
	rPick1: text("r_pick_1"),
	rPick2: text("r_pick_2"),
	rPick3: text("r_pick_3"),
	rPick4: text("r_pick_4"),
	rPick5: text("r_pick_5"),
	bBan1: text("b_ban_1"),
	bBan2: text("b_ban_2"),
	bBan3: text("b_ban_3"),
	bBan4: text("b_ban_4"),
	bBan5: text("b_ban_5"),
	rBan1: text("r_ban_1"),
	rBan2: text("r_ban_2"),
	rBan3: text("r_ban_3"),
	rBan4: text("r_ban_4"),
	rBan5: text("r_ban_5"),
	draftFinished: boolean("draft_finished").default(false).notNull(),
	fearlessCode: text("fearless_code"),
}, (table) => [
	index("draft_lobbies_lobby_code_idx").using("btree", table.lobbyCode.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.shortcode],
			foreignColumns: [games.shortcode],
			name: "draft_lobbies_shortcode_fkey"
		}),
	foreignKey({
			columns: [table.fearlessCode],
			foreignColumns: [fearlessDraftLobbies.fearlessCode],
			name: "fk_fearless_code"
		}),
	unique("draft_lobbies_shortcode_key").on(table.shortcode),
]);

export const fearlessDraftLobbies = pgTable("fearless_draft_lobbies", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "fearless_draft_lobbies_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	fearlessCode: text("fearless_code").notNull(),
	blueCode: text("blue_code").notNull(),
	redCode: text("red_code").notNull(),
	redName: text("red_name").notNull(),
	blueName: text("blue_name").notNull(),
	draftLobby1: text("draft_lobby_1"),
	draftLobby2: text("draft_lobby_2"),
	draftLobby3: text("draft_lobby_3"),
	draftLobby4: text("draft_lobby_4"),
	draftLobby5: text("draft_lobby_5"),
	fearlessComplete: boolean("fearless_complete").default(false),
}, (table) => [
	unique("unique_fearless_code").on(table.fearlessCode),
]);
