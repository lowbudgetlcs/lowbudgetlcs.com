import {
  pgTable,
  pgSchema,
  unique,
  integer,
  text,
  boolean,
  foreignKey,
  serial,
  timestamp,
  bigint,
  varchar,
  type AnyPgColumn,
  index,
  char,
  jsonb,
  smallint,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const website = pgSchema("website");
export const eventStatus = pgEnum("event_status", [
  "active",
  "complete",
  "canceled",
  "paused",
  "preparing",
]);

export const draftLobbiesInWebsite = website.table(
  "draft_lobbies",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "website.draft_lobbies_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    shortcode: text(),
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
  },
  (table) => [unique("draft_lobbies_shortcode_key").on(table.shortcode)]
);

export const teamsInWebsite = website.table(
  "teams",
  {
    id: serial().primaryKey().notNull(),
    divisionId: integer("division_id"),
    teamName: text("team_name").notNull(),
    teamTag: text("team_tag").notNull(),
    active: boolean().default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    formerTeam: bigint("former_team", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisionsInWebsite.id],
      name: "teams_division_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.formerTeam],
      foreignColumns: [table.id],
      name: "teams_former_team_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);

export const fearlessDraftLobbiesInWebsite = website.table("fearless_draft_lobbies", {
  id: integer()
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "website.fearless_draft_lobbies_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
  fearlessCode: text("fearless_code").notNull(),
  team1Code: text("team1_code").notNull(),
  team2Code: text("team2_code").notNull(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  totalDrafts: integer("total_drafts").notNull(),
  fearlessComplete: boolean("fearless_complete").default(false),
});

export const seasonsInWebsite = website.table(
  "seasons",
  {
    id: serial().primaryKey().notNull(),
    seasonName: text("season_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => [unique("seasons_season_name_key").on(table.seasonName)]
);

export const divisionsInWebsite = website.table(
  "divisions",
  {
    id: serial().primaryKey().notNull(),
    seasonId: integer("season_id").notNull(),
    divisionName: text("division_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.seasonId],
      foreignColumns: [seasonsInWebsite.id],
      name: "divisions_season_id_fkey",
    }).onDelete("cascade"),
    unique("divisions_division_name_key").on(table.divisionName),
  ]
);

export const asTeams = pgTable("as_teams", {
  id: integer()
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "public.as_teams_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
  seasonId: integer("season_id").notNull(),
  division: text().notNull(),
  image: text().notNull(),
  name: text().notNull(),
  player1Text: text("player1_text"),
  player2Text: text("player2_text"),
  player3Text: text("player3_text"),
  player4Text: text("player4_text"),
  player5Text: text("player5_text"),
});

export const commandChannelPermissions = pgTable("command_channel_permissions", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  channelId: text("channel_id").notNull(),
});

export const commandRolePermissions = pgTable("command_role_permissions", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  roleId: text("role_id").notNull(),
});

export const players = pgTable(
  "players",
  {
    id: serial().primaryKey().notNull(),
    riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
    summonerName: text("summoner_name").notNull(),
    teamId: integer("team_id"),
  },
  (table) => [
    index("players_summoner_name_idx").using(
      "btree",
      table.summonerName.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "fk_team_id",
    }).onDelete("set null"),
    unique("players_riot_puuid_key").on(table.riotPuuid),
  ]
);

export const series = pgTable(
  "series",
  {
    id: serial().primaryKey().notNull(),
    divisionId: integer("division_id").notNull(),
    winnerId: integer("winner_id"),
    loserId: integer("loser_id"),
  },
  (table) => [
    index("series_loser_id_idx").using("btree", table.loserId.asc().nullsLast().op("int4_ops")),
    index("series_winner_id_idx").using("btree", table.winnerId.asc().nullsLast().op("int4_ops")),
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisions.id],
      name: "fk_division_id",
    }),
    foreignKey({
      columns: [table.loserId],
      foreignColumns: [teams.id],
      name: "fk_loser_id",
    }),
    foreignKey({
      columns: [table.winnerId],
      foreignColumns: [teams.id],
      name: "fk_winner_id",
    }),
  ]
);

export const divisions = pgTable(
  "divisions",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    tournamentId: integer("tournament_id").notNull(),
  },
  (table) => [unique("divisions_name_key").on(table.name)]
);

export const teamToSeries = pgTable(
  "team_to_series",
  {
    id: serial().primaryKey().notNull(),
    teamId: integer("team_id").notNull(),
    seriesId: integer("series_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.seriesId],
      foreignColumns: [series.id],
      name: "fk_series_id",
    }),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "fk_team_id",
    }),
  ]
);

export const playerPerformances = pgTable(
  "player_performances",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.player_performances_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    playerId: integer("player_id").notNull(),
    gameId: integer("game_id").notNull(),
    teamId: integer("team_id").notNull(),
    divisionId: integer("division_id").notNull(),
  },
  (table) => [
    index("player_performances_division_id_idx").using(
      "btree",
      table.divisionId.asc().nullsLast().op("int4_ops")
    ),
    index("player_performances_game_id_idx").using(
      "btree",
      table.gameId.asc().nullsLast().op("int4_ops")
    ),
    index("player_performances_player_id_idx").using(
      "btree",
      table.playerId.asc().nullsLast().op("int4_ops")
    ),
    index("player_performances_team_id_idx").using(
      "btree",
      table.teamId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisions.id],
      name: "player_performances_division_id_fkey",
    }),
    foreignKey({
      columns: [table.gameId],
      foreignColumns: [games.id],
      name: "player_performances_game_id_fkey",
    }),
    foreignKey({
      columns: [table.playerId],
      foreignColumns: [players.id],
      name: "player_performances_player_id_fkey",
    }),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "player_performances_team_id_fkey",
    }),
    unique("player_performances_player_id_game_id_key").on(table.playerId, table.gameId),
  ]
);

export const meta = pgTable("meta", {
  id: integer().primaryKey().notNull(),
  seasonName: text("season_name").notNull(),
  providerId: integer("provider_id").notNull(),
});

export const teamPerformances = pgTable(
  "team_performances",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.team_performances_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    teamId: integer("team_id"),
    gameId: integer("game_id"),
    divisionId: integer("division_id"),
  },
  (table) => [
    index("team_performances_division_id_idx").using(
      "btree",
      table.divisionId.asc().nullsLast().op("int4_ops")
    ),
    index("team_performances_division_id_idx1").using(
      "btree",
      table.divisionId.asc().nullsLast().op("int4_ops")
    ),
    index("team_performances_game_id_idx").using(
      "btree",
      table.gameId.asc().nullsLast().op("int4_ops")
    ),
    index("team_performances_team_id_idx").using(
      "btree",
      table.teamId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisions.id],
      name: "team_performances_division_id_fkey",
    }),
    foreignKey({
      columns: [table.gameId],
      foreignColumns: [games.id],
      name: "team_performances_game_id_fkey",
    }),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: "team_performances_team_id_fkey",
    }),
    unique("team_performances_team_id_game_id_key").on(table.teamId, table.gameId),
  ]
);

export const teamGameData = pgTable(
  "team_game_data",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.team_game_data_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
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
  },
  (table) => [
    foreignKey({
      columns: [table.teamPerformanceId],
      foreignColumns: [teamPerformances.id],
      name: "team_game_data_team_performance_id_fkey",
    }),
    unique("team_game_data_team_performance_id_key").on(table.teamPerformanceId),
  ]
);

export const fearlessDraftLobbies = pgTable(
  "fearless_draft_lobbies",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.fearless_draft_lobbies_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    fearlessCode: text("fearless_code").notNull(),
    team1Code: text("team1_code").notNull(),
    team2Code: text("team2_code").notNull(),
    team1Name: text("team1_name").notNull(),
    team2Name: text("team2_name").notNull(),
    fearlessComplete: boolean("fearless_complete").default(false),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalDrafts: bigint("total_drafts", { mode: "number" }),
  },
  (table) => [unique("unique_fearless_code").on(table.fearlessCode)]
);

export const gameDumps = pgTable(
  "game_dumps",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.game_dumps_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    gameId: integer("game_id").notNull(),
    dump: jsonb().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.gameId],
      foreignColumns: [games.id],
      name: "game_dumps_game_id_fkey",
    }),
    unique("game_dumps_game_id_key").on(table.gameId),
  ]
);

export const playerGameData = pgTable(
  "player_game_data",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.player_game_data_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
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
  },
  (table) => [
    foreignKey({
      columns: [table.playerPerformanceId],
      foreignColumns: [playerPerformances.id],
      name: "player_game_data_player_performance_id_fkey",
    }),
    unique("player_game_data_player_performance_id_key").on(table.playerPerformanceId),
  ]
);

export const games = pgTable(
  "games",
  {
    id: serial().primaryKey().notNull(),
    shortcode: text().notNull(),
    gameNum: integer("game_num").notNull(),
    winnerId: integer("winner_id"),
    loserId: integer("loser_id"),
    callbackResult: jsonb("callback_result"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    seriesId: integer("series_id"),
  },
  (table) => [
    index("games_loser_id_idx").using("btree", table.loserId.asc().nullsLast().op("int4_ops")),
    index("games_series_id_idx").using("btree", table.seriesId.asc().nullsLast().op("int4_ops")),
    index("games_winner_id_idx").using("btree", table.winnerId.asc().nullsLast().op("int4_ops")),
    foreignKey({
      columns: [table.loserId],
      foreignColumns: [teams.id],
      name: "fk_loser_id",
    }),
    foreignKey({
      columns: [table.seriesId],
      foreignColumns: [series.id],
      name: "fk_series_id",
    }),
    foreignKey({
      columns: [table.winnerId],
      foreignColumns: [teams.id],
      name: "fk_winner_id",
    }),
    unique("games_shortcode_key").on(table.shortcode),
  ]
);

export const teams = pgTable(
  "teams",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    logo: text(),
    captainId: integer("captain_id"),
    divisionId: integer("division_id"),
  },
  (table) => [
    index("teams_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisions.id],
      name: "fk_division_id",
    }),
  ]
);

export const gamesInWebsite = website.table(
  "games",
  {
    id: serial().primaryKey().notNull(),
    shortcode: text().notNull(),
    gameNum: integer("game_num").notNull(),
    winnerId: integer("winner_id"),
    loserId: integer("loser_id"),
    callbackResult: jsonb("callback_result"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.loserId],
      foreignColumns: [teams.id],
      name: "fk_loser_id",
    }),
    foreignKey({
      columns: [table.winnerId],
      foreignColumns: [teams.id],
      name: "fk_winner_id",
    }),
    unique("games_shortcode_key").on(table.shortcode),
  ]
);

export const draftLobbies = pgTable(
  "draft_lobbies",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "public.draft_lobbies_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    shortcode: text(),
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
  },
  (table) => [
    foreignKey({
      columns: [table.fearlessCode],
      foreignColumns: [fearlessDraftLobbies.fearlessCode],
      name: "fk_fearless_code",
    }),
    unique("draft_lobbies_shortcode_key").on(table.shortcode),
  ]
);

export const playersInWebsite = website.table("players", {
  puuid: text().primaryKey().notNull(),
  summonerName: text("summoner_name").notNull(),
  tagLine: text("tag_line").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const playerTeamHistoryInWebsite = website.table(
  "player_team_history",
  {
    id: serial().primaryKey().notNull(),
    playerPuuid: text("player_puuid").notNull(),
    teamId: integer("team_id").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
  },
  (table) => [
    foreignKey({
      columns: [table.playerPuuid],
      foreignColumns: [playersInWebsite.puuid],
      name: "player_team_history_player_puuid_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teamsInWebsite.id],
      name: "player_team_history_team_id_fkey",
    }).onDelete("cascade"),
  ]
);

export const matchesInWebsite = website.table(
  "matches",
  {
    matchId: text("match_id").primaryKey().notNull(),
    divisionId: integer("division_id"),
    gameVersion: text("game_version"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    gameCreation: bigint("game_creation", { mode: "number" }).notNull(),
    gameDuration: integer("game_duration").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    gameStartTimeStamp: bigint("game_start_time_stamp", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    gameEndTimeStamp: bigint("game_end_time_stamp", { mode: "number" }).notNull(),
    endOfGameResult: text("end_of_game_result").notNull(),
    queueId: integer("queue_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisionsInWebsite.id],
      name: "matches_division_id_fkey",
    }).onDelete("set null"),
  ]
);

export const matchTeamStatsInWebsite = website.table(
  "match_team_stats",
  {
    id: serial().primaryKey().notNull(),
    matchId: text("match_id").notNull(),
    teamId: integer("team_id").notNull(),
    riotTeamId: integer("riot_team_id").notNull(),
    win: boolean().notNull(),
    baronKills: integer("baron_kills").default(0),
    dragonKills: integer("dragon_kills").default(0),
    inhibitorKills: integer("inhibitor_kills").default(0),
    riftHeraldKills: integer("rift_herald_kills").default(0),
    towerKills: integer("tower_kills").default(0),
    hordeKills: integer("horde_kills").default(0),
    atakhanKills: integer("atakhan_kills").default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matchesInWebsite.matchId],
      name: "match_team_stats_match_id_fkey",
    }).onDelete("cascade"),
    unique("match_team_stats_match_id_team_id_key").on(table.matchId, table.teamId),
    unique("match_team_stats_match_id_riot_team_id_key").on(table.matchId, table.riotTeamId),
  ]
);

export const matchParticipantsInWebsite = website.table(
  "match_participants",
  {
    id: serial().primaryKey().notNull(),
    matchId: text("match_id").notNull(),
    playerPuuid: text("player_puuid").notNull(),
    participantId: integer("participant_id").notNull(),
    teamId: integer("team_id").notNull(),
    championId: integer("champion_id").notNull(),
    championName: text("champion_name"),
    championTransform: integer("champion_transform").default(0),
    teamPosition: text("team_position"),
    individualPosition: text("individual_position"),
    riotIdGameName: text("riot_id_game_name"),
    riotIdTagLine: text("riot_id_tag_line"),
    role: text(),
    summonerLevel: integer("summoner_level"),
    summonerName: text("summoner_name"),
    kills: integer().default(0),
    deaths: integer().default(0),
    assists: integer().default(0),
    bountyLevel: integer("bounty_level").default(0),
    killingSprees: integer("killing_sprees").default(0),
    largestKillingSpree: integer("largest_killing_spree").default(0),
    largestMultiKill: integer("largest_multi_kill").default(0),
    doubleKills: integer("double_kills").default(0),
    tripleKills: integer("triple_kills").default(0),
    quadraKills: integer("quadra_kills").default(0),
    pentaKills: integer("penta_kills").default(0),
    unrealKills: integer("unreal_kills").default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalDamageDealt: bigint("total_damage_dealt", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    physicalDamageDealt: bigint("physical_damage_dealt", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    magicDamageDealt: bigint("magic_damage_dealt", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    trueDamageDealt: bigint("true_damage_dealt", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalDamageDealtToChampions: bigint("total_damage_dealt_to_champions", {
      mode: "number",
    }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    physicalDamageDealtToChampions: bigint("physical_damage_dealt_to_champions", {
      mode: "number",
    }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    magicDamageDealtToChampions: bigint("magic_damage_dealt_to_champions", {
      mode: "number",
    }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    trueDamageDealtToChampions: bigint("true_damage_dealt_to_champions", {
      mode: "number",
    }).default(0),
    largestCriticalStrike: integer("largest_critical_strike").default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalDamageTaken: bigint("total_damage_taken", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    physicalDamageTaken: bigint("physical_damage_taken", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    magicDamageTaken: bigint("magic_damage_taken", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    trueDamageTaken: bigint("true_damage_taken", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    damageSelfMitigated: bigint("damage_self_mitigated", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalHeal: bigint("total_heal", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalHealsOnTeammates: bigint("total_heals_on_teammates", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalDamageShieldedOnTeammates: bigint("total_damage_shielded_on_teammates", {
      mode: "number",
    }).default(0),
    totalUnitsHealed: integer("total_units_healed").default(0),
    goldEarned: integer("gold_earned").default(0),
    goldSpent: integer("gold_spent").default(0),
    champExperience: integer("champ_experience").default(0),
    champLevel: integer("champ_level").default(0),
    totalMinionsKilled: integer("total_minions_killed").default(0),
    neutralMinionsKilled: integer("neutral_minions_killed").default(0),
    totalAllyJungleMinionsKilled: integer("total_ally_jungle_minions_killed").default(0),
    totalEnemyJungleMinionsKilled: integer("total_enemy_jungle_minions_killed").default(0),
    visionScore: integer("vision_score").default(0),
    wardsPlaced: integer("wards_placed").default(0),
    wardsKilled: integer("wards_killed").default(0),
    detectorWardsPlaced: integer("detector_wards_placed").default(0),
    sightWardsBoughtInGame: integer("sight_wards_bought_in_game").default(0),
    visionWardsBoughtInGame: integer("vision_wards_bought_in_game").default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    damageDealtToBuildings: bigint("damage_dealt_to_buildings", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    damageDealtToObjectives: bigint("damage_dealt_to_objectives", { mode: "number" }).default(0),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    damageDealtToTurrets: bigint("damage_dealt_to_turrets", { mode: "number" }).default(0),
    baronKills: integer("baron_kills").default(0),
    dragonKills: integer("dragon_kills").default(0),
    inhibitorKills: integer("inhibitor_kills").default(0),
    inhibitorTakedowns: integer("inhibitor_takedowns").default(0),
    inhibitorsLost: integer("inhibitors_lost").default(0),
    nexusKills: integer("nexus_kills").default(0),
    nexusTakedowns: integer("nexus_takedowns").default(0),
    nexusLost: integer("nexus_lost").default(0),
    objectivesStolen: integer("objectives_stolen").default(0),
    objectivesStolenAssists: integer("objectives_stolen_assists").default(0),
    turretKills: integer("turret_kills").default(0),
    turretTakedowns: integer("turret_takedowns").default(0),
    turretsLost: integer("turrets_lost").default(0),
    firstBloodAssist: boolean("first_blood_assist"),
    firstBloodKill: boolean("first_blood_kill"),
    firstTowerAssist: boolean("first_tower_assist"),
    firstTowerKill: boolean("first_tower_kill"),
    timePlayed: integer("time_played").default(0),
    longestTimeSpentLiving: integer("longest_time_spent_living").default(0),
    totalTimeSpentDead: integer("total_time_spent_dead").default(0),
    totalTimeCcDealt: integer("total_time_cc_dealt").default(0),
    timeCcingOthers: integer("time_ccing_others").default(0),
    itemsPurchased: integer("items_purchased").default(0),
    consumablesPurchased: integer("consumables_purchased").default(0),
    item0: integer(),
    item1: integer(),
    item2: integer(),
    item3: integer(),
    item4: integer(),
    item5: integer(),
    item6: integer(),
    summoner1Id: integer("summoner1_id"),
    summoner2Id: integer("summoner2_id"),
    summoner1Casts: integer("summoner1_casts").default(0),
    summoner2Casts: integer("summoner2_casts").default(0),
    spell1Casts: integer("spell1_casts").default(0),
    spell2Casts: integer("spell2_casts").default(0),
    spell3Casts: integer("spell3_casts").default(0),
    spell4Casts: integer("spell4_casts").default(0),
    allInPings: integer("all_in_pings").default(0),
    assistMePings: integer("assist_me_pings").default(0),
    commandPings: integer("command_pings").default(0),
    enemyMissingPings: integer("enemy_missing_pings").default(0),
    enemyVisionPings: integer("enemy_vision_pings").default(0),
    getBackPings: integer("get_back_pings").default(0),
    holdPings: integer("hold_pings").default(0),
    needVisionPings: integer("need_vision_pings").default(0),
    onMyWayPings: integer("on_my_way_pings").default(0),
    pushPings: integer("push_pings").default(0),
    visionClearedPings: integer("vision_cleared_pings").default(0),
    win: boolean().notNull(),
    gameEndedInSurrender: boolean("game_ended_in_surrender"),
    gameEndedInEarlySurrender: boolean("game_ended_in_early_surrender"),
    teamEarlySurrendered: boolean("team_early_surrendered"),
    perks: jsonb(),
    challenges: jsonb(),
  },
  (table) => [
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matchesInWebsite.matchId],
      name: "match_participants_match_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.playerPuuid],
      foreignColumns: [playersInWebsite.puuid],
      name: "match_participants_player_puuid_fkey",
    }),
  ]
);

export const currentSeasonDivisionsInWebsite = website.table(
  "current_season_divisions",
  {
    name: text().primaryKey().notNull(),
    spreadSheetId: text("spread_sheet_id").notNull(),
    folderId: text("folder_id"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eventId: bigint("event_id", { mode: "number" }),
    divisionId: integer("division_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.divisionId],
      foreignColumns: [divisionsInWebsite.id],
      name: "current_season_divisions_division_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
