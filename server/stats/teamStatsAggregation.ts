import { getGamesForTeam } from "../db/queries/statQueries/select";

interface RosterPlayerStat {
  summonerName: string;
  gamesPlayed: number;
  winrate: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  roles?: string[];
  riotIdGameName?: string;
  riotIdTagLine?: string;
}

interface SidePerformance {
  games: number;
  wins: number;
  winrate: number;
}

interface LaneDistribution {
  gold: number;
  damage: number;
  vision: number;
}

export interface TeamOverallStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  avgGameDuration: number;
  kda: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgVisionScore: number;
  avgDamagePerMin: number;
  avgGoldPerMin: number;
  // Objective Stats
  avgBarons: number;
  avgDragons: number;
  avgTowers: number;
  avgInhibitors: number;
  avgGrubs: number;
  avgHeralds: number;
  avgAtahkhan: number;
  firstBloodRate: number;
  firstTowerRate: number;
  firstDragonRate: number;
  firstBaronRate: number;
  firstInhibitorRate: number;
  dragonControlRate: number;
  voidGrubControlRate: number;
  blueSidePerformance: SidePerformance;
  redSidePerformance: SidePerformance;
  laneDistribution: Record<string, LaneDistribution>;
  goldDistribution?: Record<string, number>;
  damageDistribution?: Record<string, number>;
  visionDistribution?: Record<string, number>;
  // Roster Breakdown
  roster: RosterPlayerStat[];
}

const teamStatsAggregation = async (teamId: number): Promise<TeamOverallStats | null> => {
  const games = await getGamesForTeam(teamId);
  if (!games || games.length === 0) {
    return null;
  }

  const initialRosterStats: {
    [key: string]: RosterPlayerStat & {
      totalKills: number;
      totalDeaths: number;
      totalAssists: number;
      wins: number;
      roleCounts: Record<string, number>;
      gameName: string;
      tagLine: string;
    };
  } = {};
  const initialLaneDistribution = {
    TOP: { gold: 0, damage: 0, vision: 0 },
    JUNGLE: { gold: 0, damage: 0, vision: 0 },
    MIDDLE: { gold: 0, damage: 0, vision: 0 },
    BOTTOM: { gold: 0, damage: 0, vision: 0 },
    UTILITY: { gold: 0, damage: 0, vision: 0 },
  };

  const totalObjectiveKillsInAllGames = games.reduce(
    (acc, game) => {
      game.teams.forEach((t) => {
        acc.dragons += t.match_team_stats.dragonKills ?? 0;
        acc.grubs += t.match_team_stats.hordeKills ?? 0;
      });
      return acc;
    },
    { dragons: 0, grubs: 0 }
  );

  const stats = games.reduce(
    (acc, game) => {
      const team = game.teams.find((t) => t.match_team_stats.teamId === teamId);
      if (!team) return acc;

      const teamStats = team.match_team_stats;

      const isBlueSide = teamStats.riotTeamId === 100;
      if (isBlueSide) {
        acc.blueSideGames += 1;
        if (teamStats.win) acc.blueSideWins += 1;
      } else {
        acc.redSideGames += 1;
        if (teamStats.win) acc.redSideWins += 1;
      }

      const teamParticipants = game.participants.filter((p) => p.teamId === team.teams?.id);
      const teamTotalsForGame = teamParticipants.reduce(
        (teamAcc, p) => {
          teamAcc.kills += p.kills ?? 0;
          teamAcc.deaths += p.deaths ?? 0;
          teamAcc.assists += p.assists ?? 0;
          teamAcc.gold += p.goldEarned ?? 0;
          teamAcc.damage += Number(p.totalDamageDealtToChampions ?? 0);
          teamAcc.visionScore += p.visionScore ?? 0;
          return teamAcc;
        },
        { kills: 0, deaths: 0, assists: 0, gold: 0, damage: 0, visionScore: 0 }
      );

      // Updates Totals
      acc.totalGames += 1;
      if (teamStats.win) acc.wins += 1;
      acc.totalGameDuration += game.gameDuration;
      acc.totalKills += teamTotalsForGame.kills;
      acc.totalDeaths += teamTotalsForGame.deaths;
      acc.totalAssists += teamTotalsForGame.assists;
      acc.totalGold += teamTotalsForGame.gold;
      acc.totalDamage += teamTotalsForGame.damage;
      acc.totalVisionScore += teamTotalsForGame.visionScore;

      acc.totalBarons += teamStats.baronKills ?? 0;
      acc.totalDragons += teamStats.dragonKills ?? 0;
      acc.totalTowers += teamStats.towerKills ?? 0;
      acc.totalInhibitors += teamStats.inhibitorKills ?? 0;
      acc.totalGrubs += teamStats.hordeKills ?? 0;
      acc.totalAtakhan += teamStats.atakhanKills ?? 0;
      acc.totalHeralds += teamStats.riftHeraldKills ?? 0;

      let teamGotFirstBlood = false;
      let teamGotFirstTower = false;

    //   Makes sure role is the correct type to satisfy Typescript
      type LaneRole = keyof typeof initialLaneDistribution;
      function isLaneRole(role: string): role is LaneRole {
        return role in initialLaneDistribution;
      }

      // Updates Roster and check for first objectives
      teamParticipants.forEach((player) => {
        const role = player.teamPosition;
        if (role && isLaneRole(role)) {
          if (teamTotalsForGame.gold > 0)
            acc.laneDistribution[role].gold += (player.goldEarned ?? 0) / teamTotalsForGame.gold;
          if (teamTotalsForGame.damage > 0)
            acc.laneDistribution[role].damage +=
              Number(player.totalDamageDealtToChampions ?? 0) / teamTotalsForGame.damage;
          if (teamTotalsForGame.visionScore > 0)
            acc.laneDistribution[role].vision +=
              (player.visionScore ?? 0) / teamTotalsForGame.visionScore;
        }
        if (player.firstBloodKill) teamGotFirstBlood = true;
        if (player.firstTowerKill) teamGotFirstTower = true;

        const gameName = player.riotIdGameName ?? "Unknown";
        const tagLine = player.riotIdTagLine ?? "Unknown";
        const name = `${gameName}-${tagLine}`;
        if (!acc.rosterStats[name]) {
          acc.rosterStats[name] = {
            summonerName: name,
            gamesPlayed: 0,
            winrate: 0,
            kda: 0,
            avgKills: 0,
            avgDeaths: 0,
            avgAssists: 0,
            totalKills: 0,
            totalDeaths: 0,
            totalAssists: 0,
            wins: 0,
            roleCounts: {},
            gameName,
            tagLine,
          };
        }
        const rosterPlayer = acc.rosterStats[name];
        rosterPlayer.gamesPlayed += 1;
        if (player.win) rosterPlayer.wins += 1;
        rosterPlayer.totalKills += player.kills ?? 0;
        rosterPlayer.totalDeaths += player.deaths ?? 0;
        rosterPlayer.totalAssists += player.assists ?? 0;
        // track role counts
        const playerRole = player.teamPosition ?? 'UNKNOWN';
        rosterPlayer.roleCounts[playerRole] = (rosterPlayer.roleCounts[playerRole] ?? 0) + 1;
      });

      if (teamGotFirstBlood) acc.firstBloodCount += 1;
      if (teamGotFirstTower) acc.firstTowerCount += 1;

      return acc;
    },
    {
      totalGames: 0,
      wins: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalAssists: 0,
      totalGold: 0,
      totalDamage: 0,
      totalVisionScore: 0,
      totalGameDuration: 0,
      totalBarons: 0,
      totalDragons: 0,
      totalTowers: 0,
      totalInhibitors: 0,
      totalGrubs: 0,
      totalAtakhan: 0,
      totalHeralds: 0,
      firstBloodCount: 0,
      firstTowerCount: 0,
      firstDragonCount: 0,
      firstBaronCount: 0,
      firstInhibitorCount: 0,
      blueSideGames: 0,
      blueSideWins: 0,
      redSideGames: 0,
      redSideWins: 0,
      rosterStats: initialRosterStats,
      laneDistribution: initialLaneDistribution,
    }
  );

  const totalGames = stats.totalGames;
  const totalDurationMinutes = stats.totalGameDuration > 0 ? stats.totalGameDuration / 60 : 1;

  // Final calculations for roster players
  const roster = Object.values(stats.rosterStats)
    .map((player) => {
      const games = player.gamesPlayed;
      if (games === 0) {
        return {
          ...player,
          winrate: 0,
          avgKills: 0,
          avgDeaths: 0,
          avgAssists: 0,
          kda: 0,
        } as RosterPlayerStat;
      }
      player.winrate = (player.wins / games) * 100;
      player.avgKills = player.totalKills / games;
      player.avgDeaths = player.totalDeaths / games;
      player.avgAssists = player.totalAssists / games;
      player.kda =
        (player.totalKills + player.totalAssists) /
        (player.totalDeaths === 0 ? 1 : player.totalDeaths);
      // derive roles from the roleCounts map, sorted by frequency
      const entries = Object.entries((player as any).roleCounts || {}) as [string, number][];
      const sortedRoles = entries.sort((a, b) => b[1] - a[1]).map((r) => r[0]);
      const roles = sortedRoles.slice(0, 2); // top 2 roles
      return {
        ...player,
        roles,
        // include both gameName and tagLine for linking
        riotIdGameName: (player as any).gameName,
        riotIdTagLine: (player as any).tagLine,
      } as unknown as RosterPlayerStat & { roles: string[]; riotIdGameName: string; riotIdTagLine: string };
    })
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  const finalLaneDistribution: Record<string, LaneDistribution> = (
    Object.keys(stats.laneDistribution) as Array<keyof typeof stats.laneDistribution>
  ).reduce((acc, role) => {
    acc[role === "UTILITY" ? "SUPPORT" : role] = {
      gold: totalGames > 0 ? (stats.laneDistribution[role].gold / totalGames) * 100 : 0,
      damage: totalGames > 0 ? (stats.laneDistribution[role].damage / totalGames) * 100 : 0,
      vision: totalGames > 0 ? (stats.laneDistribution[role].vision / totalGames) * 100 : 0,
    };
    return acc;
  }, {} as Record<string, LaneDistribution>);

  // Also prepare direct distributions (simple numeric map) for client convenience
  const goldDistribution: Record<string, number> = {};
  const damageDistribution: Record<string, number> = {};
  const visionDistribution: Record<string, number> = {};
  Object.keys(finalLaneDistribution).forEach((k) => {
    const v = finalLaneDistribution[k];
    goldDistribution[k] = v.gold;
    damageDistribution[k] = v.damage;
    visionDistribution[k] = v.vision;
  });

  return {
    totalGames: totalGames,
    wins: stats.wins,
    losses: totalGames - stats.wins,
    winrate: totalGames > 0 ? (stats.wins / totalGames) * 100 : 0,
    avgGameDuration: totalGames > 0 ? stats.totalGameDuration / totalGames : 0,
    kda:
      (stats.totalKills + stats.totalAssists) / (stats.totalDeaths === 0 ? 1 : stats.totalDeaths),
    avgKills: totalGames > 0 ? stats.totalKills / totalGames : 0,
    avgDeaths: totalGames > 0 ? stats.totalDeaths / totalGames : 0,
    avgAssists: totalGames > 0 ? stats.totalAssists / totalGames : 0,
    avgVisionScore: totalGames > 0 ? stats.totalVisionScore / totalGames : 0,
    avgDamagePerMin: stats.totalDamage / totalDurationMinutes,
    avgGoldPerMin: stats.totalGold / totalDurationMinutes,
    avgBarons: totalGames > 0 ? stats.totalBarons / totalGames : 0,
    avgDragons: totalGames > 0 ? stats.totalDragons / totalGames : 0,
    avgTowers: totalGames > 0 ? stats.totalTowers / totalGames : 0,
    avgInhibitors: totalGames > 0 ? stats.totalInhibitors / totalGames : 0,
    avgGrubs: totalGames > 0 ? stats.totalGrubs / totalGames : 0,
    avgAtahkhan: totalGames > 0 ? stats.totalAtakhan / totalGames : 0,
    avgHeralds: totalGames > 0 ? stats.totalHeralds / totalGames : 0,
    firstBloodRate: totalGames > 0 ? (stats.firstBloodCount / totalGames) * 100 : 0,
    firstTowerRate: totalGames > 0 ? (stats.firstTowerCount / totalGames) * 100 : 0,
    firstDragonRate: totalGames > 0 ? (stats.firstDragonCount / totalGames) * 100 : 0,
    firstBaronRate: totalGames > 0 ? (stats.firstBaronCount / totalGames) * 100 : 0,
    firstInhibitorRate: totalGames > 0 ? (stats.firstInhibitorCount / totalGames) * 100 : 0,
    dragonControlRate:
      totalObjectiveKillsInAllGames.dragons > 0
        ? (stats.totalDragons / totalObjectiveKillsInAllGames.dragons) * 100
        : 0,
    voidGrubControlRate:
      totalObjectiveKillsInAllGames.grubs > 0
        ? (stats.totalGrubs / totalObjectiveKillsInAllGames.grubs) * 100
        : 0,
    blueSidePerformance: {
      games: stats.blueSideGames,
      wins: stats.blueSideWins,
      winrate: stats.blueSideGames > 0 ? (stats.blueSideWins / stats.blueSideGames) * 100 : 0,
    },
    redSidePerformance: {
      games: stats.redSideGames,
      wins: stats.redSideWins,
      winrate: stats.redSideGames > 0 ? (stats.redSideWins / stats.redSideGames) * 100 : 0,
    },
    laneDistribution: finalLaneDistribution,
    goldDistribution,
    damageDistribution,
    visionDistribution,
    roster: roster,
  };
};

export default teamStatsAggregation;
