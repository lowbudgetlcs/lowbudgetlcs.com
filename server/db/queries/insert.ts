import { eq } from "drizzle-orm";
import { DraftInitializeProps, DraftStateProps } from "../../draftTool/states/draftState";
import { db } from "../index";
import {
  draftLobbiesInWebsite,
  fearlessDraftLobbiesInWebsite,
  matchesInWebsite,
  matchParticipantsInWebsite,
  matchTeamStatsInWebsite,
  playerTeamHistoryInWebsite,
  teamsInWebsite,
} from "../schema";
import {
  FearlessFinishedProps,
  FearlessInitializerProps,
} from "../../draftTool/interfaces/initializerInferfaces";
import { DbTeamData } from "../../stats/playerTeamUpdaters/updateTeamServices/teamHistoryUpdater";
import formatDate from "../../stats/utils/formatDate";
import { RiotAPITypes } from "@fightmegg/riot-api";
import { ProcessedGameData } from "../../stats/insertGames/processApiGameData";

export async function insertDraft(draft: DraftInitializeProps) {
  try {
    const insertDraft = await db
      .insert(draftLobbiesInWebsite)
      .values({
        lobbyCode: draft.lobbyCode,
        blueCode: draft.blueUser,
        redCode: draft.redUser,
        shortcode: draft.tournamentID,
        blueName: draft.blueDisplayName,
        redName: draft.redDisplayName,
        fearlessCode: draft.fearlessCode || null,
      })
      .returning();

    console.log("Draft initial insert success:", draft.lobbyCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertFinishedDraft(draft: DraftStateProps, lobbyCode: string) {
  try {
    const insertDraft = await db
      .update(draftLobbiesInWebsite)
      .set({
        shortcode: draft.tournamentID,
        blueCode: draft.blueUser,
        redCode: draft.redUser,
        lobbyCode: lobbyCode,
        blueName: draft.blueDisplayName,
        redName: draft.redDisplayName,
        bPick1: draft.bluePicks[0],
        bPick2: draft.bluePicks[1],
        bPick3: draft.bluePicks[2],
        bPick4: draft.bluePicks[3],
        bPick5: draft.bluePicks[4],
        rPick1: draft.redPicks[0],
        rPick2: draft.redPicks[1],
        rPick3: draft.redPicks[2],
        rPick4: draft.redPicks[3],
        rPick5: draft.redPicks[4],
        bBan1: draft.blueBans[0],
        bBan2: draft.blueBans[1],
        bBan3: draft.blueBans[2],
        bBan4: draft.blueBans[3],
        bBan5: draft.blueBans[4],
        rBan1: draft.redBans[0],
        rBan2: draft.redBans[1],
        rBan3: draft.redBans[2],
        rBan4: draft.redBans[3],
        rBan5: draft.redBans[4],
        draftFinished: true,
      })
      .where(eq(draftLobbiesInWebsite.lobbyCode, lobbyCode));

    console.log("Draft full insert success:", lobbyCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertInitialFearlessLobby({
  fearlessCode,
  team1Code,
  team2Code,
  team1Name,
  team2Name,
  draftCount,
}: FearlessInitializerProps) {
  try {
    const insertFearlessLobby = await db
      .insert(fearlessDraftLobbiesInWebsite)
      .values({
        fearlessCode: fearlessCode,
        team1Code: team1Code,
        team2Code: team2Code,
        team1Name: team1Name,
        team2Name: team2Name,
        totalDrafts: draftCount,
      })
      .returning();

    console.log("Fearless initial insert success:", fearlessCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertFinalFearlessLobby(draft: FearlessFinishedProps) {
  try {
    const insertFearlessLobby = await db
      .update(fearlessDraftLobbiesInWebsite)
      .set({
        fearlessComplete: true,
      })
      .where(eq(fearlessDraftLobbiesInWebsite.fearlessCode, draft.fearlessCode));

    console.log("Fearless Final insert success:", draft.fearlessCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export const insertTeams = async (teams: DbTeamData[]) => {
  try {
    await db.transaction(async (t) => {
      await t.insert(teamsInWebsite).values(teams);
    });
  } catch (err) {
    console.error("Error inserting into insertTeams: ", err);
    throw new Error("Failed to insert team into database.");
  }
};

export const insertPlayerTeamHistory = async (puuid: string, teamId: number, date: Date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    await db.insert(playerTeamHistoryInWebsite).values({
      playerPuuid: puuid,
      teamId: teamId,
      startDate: formattedDate,
    });
  } catch (err) {
    console.error("Error inserting with insertPlayerTeamHistory: ", err);
  }
};

const insertMatch = async (gameData: ProcessedGameData) => {
  try {
    const { info: matchInfo } = gameData.matchData;
    const insertMatch = await db.insert(matchesInWebsite).values({
      matchId: gameData.gameId,
      divisionId: gameData.divisionId,
      gameVersion: matchInfo.gameVersion,
      gameCreation: matchInfo.gameCreation,
      gameDuration: matchInfo.gameDuration,
      gameStartTimeStamp: matchInfo.gameStartTimestamp,
      gameEndTimeStamp: matchInfo.gameEndTimestamp,
      endOfGameResult: matchInfo.endOfGameResult,
      queueId: matchInfo.queueId,
      tournamentCode: matchInfo.tournamentCode,
    });
    return true;
  } catch (err) {
    console.error("Error inserting with insertMatch: ", err);
    return false;
  }
};

const insertMatchTeamStats = async (game: ProcessedGameData) => {
  const teamsData = game.matchData.info.teams;

  for (const team of teamsData) {
    // This is specifically for grubs and atakhan since the ObjectivesDTO is outdated 😢
    const objectives = team.objectives as any;

    await db.insert(matchTeamStatsInWebsite).values({
      matchId: game.gameId,
      teamId: team.win ? game.winningTeamId : game.losingTeamId,
      riotTeamId: team.teamId,
      win: team.win,
      baronKills: team.objectives.baron.kills,
      dragonKills: team.objectives.dragon.kills,
      inhibitorKills: team.objectives.inhibitor.kills,
      riftHeraldKills: team.objectives.riftHerald.kills,
      towerKills: team.objectives.tower.kills,
      hordeKills: objectives.horde.kills,
      atakhanKills: objectives.atakhan.kills,
    });
  }
};

const insertMatchParticipants = async (game: ProcessedGameData) => {
  const participants = game.matchData.info.participants;
  const winningRiotTeamId = game.matchData.info.teams.find((t) => t.win)?.teamId;

  for (const p of participants) {
    const participant = p as any;
    await db.insert(matchParticipantsInWebsite).values({
      matchId: game.gameId,
      playerPuuid: p.puuid,
      participantId: p.participantId,
      teamId: p.teamId === winningRiotTeamId ? game.winningTeamId : game.losingTeamId,
      championId: p.championId,
      championName: p.championName,
      championTransform: p.championTransform,
      teamPosition: p.teamPosition,
      individualPosition: p.individualPosition,
      riotIdGameName: participant.riotIdGameName,
      riotIdTagLine: p.riotIdTagline,
      role: p.role,
      summonerLevel: p.summonerLevel,
      summonerName: p.summonerName,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      bountyLevel: p.bountyLevel,
      killingSprees: p.killingSprees,
      largestKillingSpree: p.largestKillingSpree,
      largestMultiKill: p.largestMultiKill,
      doubleKills: p.doubleKills,
      tripleKills: p.tripleKills,
      quadraKills: p.quadraKills,
      pentaKills: p.pentaKills,
      unrealKills: p.unrealKills,
      totalDamageDealt: p.totalDamageDealt,
      physicalDamageDealt: p.physicalDamageDealt,
      magicDamageDealt: p.magicDamageDealt,
      trueDamageDealt: p.trueDamageDealt,
      totalDamageDealtToChampions: p.totalDamageDealtToChampions,
      physicalDamageDealtToChampions: p.physicalDamageDealtToChampions,
      magicDamageDealtToChampions: p.magicDamageDealtToChampions,
      trueDamageDealtToChampions: p.trueDamageDealtToChampions,
      largestCriticalStrike: p.largestCriticalStrike,
      totalDamageTaken: p.totalDamageTaken,
      physicalDamageTaken: p.physicalDamageTaken,
      magicDamageTaken: p.magicDamageTaken,
      trueDamageTaken: p.trueDamageTaken,
      damageSelfMitigated: p.damageSelfMitigated,
      totalHeal: p.totalHeal,
      totalHealsOnTeammates: p.totalHealsOnTeammates,
      totalDamageShieldedOnTeammates: p.totalDamageShieldedOnTeammates,
      totalUnitsHealed: p.totalUnitsHealed,
      goldEarned: p.goldEarned,
      goldSpent: p.goldSpent,
      champExperience: p.champExperience,
      champLevel: p.champLevel,
      totalMinionsKilled: p.totalMinionsKilled,
      neutralMinionsKilled: p.neutralMinionsKilled,
      totalAllyJungleMinionsKilled: participant.totalAllyJungleMinionsKilled,
      totalEnemyJungleMinionsKilled: participant.totalEnemyJungleMinionsKilled,
      visionScore: p.visionScore,
      wardsPlaced: p.wardsPlaced,
      wardsKilled: p.wardsKilled,
      detectorWardsPlaced: p.detectorWardsPlaced,
      sightWardsBoughtInGame: p.sightWardsBoughtInGame,
      visionWardsBoughtInGame: p.visionWardsBoughtInGame,
      damageDealtToBuildings: p.damageDealtToBuildings,
      damageDealtToObjectives: p.damageDealtToObjectives,
      damageDealtToTurrets: p.damageDealtToTurrets,
      baronKills: p.baronKills,
      dragonKills: p.dragonKills,
      inhibitorKills: p.inhibitorKills,
      inhibitorTakedowns: p.inhibitorTakedowns,
      inhibitorsLost: p.inhibitorsLost,
      nexusKills: p.nexusKills,
      nexusTakedowns: p.nexusTakedowns,
      nexusLost: p.nexusLost,
      objectivesStolen: p.objectivesStolen,
      objectivesStolenAssists: p.objectivesStolenAssists,
      turretKills: p.turretKills,
      turretTakedowns: p.turretTakedowns,
      turretsLost: p.turretsLost,
      firstBloodAssist: p.firstBloodAssist,
      firstBloodKill: p.firstBloodKill,
      firstTowerAssist: p.firstTowerAssist,
      firstTowerKill: p.firstTowerKill,
      timePlayed: p.timePlayed,
      longestTimeSpentLiving: p.longestTimeSpentLiving,
      totalTimeSpentDead: p.totalTimeSpentDead,
      totalTimeCcDealt: p.totalTimeCCDealt,
      timeCcingOthers: p.timeCCingOthers,
      itemsPurchased: p.itemsPurchased,
      consumablesPurchased: p.consumablesPurchased,
      item0: p.item0,
      item1: p.item1,
      item2: p.item2,
      item3: p.item3,
      item4: p.item4,
      item5: p.item5,
      item6: p.item6,
      summoner1Id: p.summoner1Id,
      summoner2Id: p.summoner2Id,
      summoner1Casts: p.summoner1Casts,
      summoner2Casts: p.summoner2Casts,
      spell1Casts: p.spell1Casts,
      spell2Casts: p.spell2Casts,
      spell3Casts: p.spell3Casts,
      spell4Casts: p.spell4Casts,
      allInPings: participant.allInPings,
      assistMePings: participant.assistMePings,
      commandPings: participant.commandPings,
      enemyMissingPings: participant.enemyMissingPings,
      enemyVisionPings: participant.enemyVisionPings,
      getBackPings: participant.getBackPings,
      holdPings: participant.holdPings,
      needVisionPings: participant.needVisionPings,
      onMyWayPings: participant.onMyWayPings,
      pushPings: participant.pushPings,
      visionClearedPings: participant.visionClearedPings,
      win: p.win,
      gameEndedInSurrender: p.gameEndedInSurrender,
      gameEndedInEarlySurrender: p.gameEndedInEarlySurrender,
      teamEarlySurrendered: p.teamEarlySurrendered,
      perks: p.perks,
      challenges: p.challenges,
    });
  }
};

export const insertFullMatchData = async (processedGames: ProcessedGameData[]) => {
  let successCount = 0;
  for (const game of processedGames) {
    try {
      await db.transaction(async (tx) => {
        await insertMatch(game);
        await insertMatchTeamStats(game);
        await insertMatchParticipants(game);
      });
      successCount++;
    } catch (error) {
      console.error(
        `[Game Stats Updater] Failed to insert data for match: ${game.gameId}. Error: ${error}`
      );
      continue;
    }
  }
  return successCount;
};
