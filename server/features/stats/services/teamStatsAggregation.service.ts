import { getCurrentRosterForTeam, getGamesForTeam, getTeamDetails } from "../../../db/queries/statQueries/select";
import { AggregationAccumulator, LaneDistribution, LaneRole, TeamOverallStats, LANE_ROLES, RosterAccumulator } from "../types/Team";

const safeDivide = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);

const normalizeRiotId = (gameName?: string | null, tagLine?: string | null) =>
  `${(gameName ?? "").trim().toLowerCase()}#${(tagLine ?? "").trim().toLowerCase()}`;

const createRosterAccumulator = (gameName: string, tagLine: string): RosterAccumulator => ({
  summonerName: `${gameName}-${tagLine}`,
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
});

const createEmptyAccumulator = (rosterStats: Record<string, RosterAccumulator>): AggregationAccumulator => ({
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
  rosterStats,
  laneDistribution: {
    TOP: { gold: 0, damage: 0, vision: 0 },
    JUNGLE: { gold: 0, damage: 0, vision: 0 },
    MIDDLE: { gold: 0, damage: 0, vision: 0 },
    BOTTOM: { gold: 0, damage: 0, vision: 0 },
    UTILITY: { gold: 0, damage: 0, vision: 0 },
  },
});

const teamStatsAggregation = async (teamId: number): Promise<TeamOverallStats | null> => {
  const [games, teamDetails, rosterFromDb] = await Promise.all([getGamesForTeam(teamId), getTeamDetails(teamId), getCurrentRosterForTeam(teamId)]);

  const rosterStats: Record<string, RosterAccumulator> = {};
  const rosterByPuuid = new Map<string, string>();
  const rosterByRiotId = new Map<string, string>();

  (rosterFromDb ?? []).forEach((player) => {
    const key = player.puuid || `${player.summonerName}-${player.tagLine}`;
    rosterStats[key] = createRosterAccumulator(player.summonerName, player.tagLine);
    if (player.puuid) rosterByPuuid.set(player.puuid, key);
    rosterByRiotId.set(normalizeRiotId(player.summonerName, player.tagLine), key);
  });

  const totalObjectiveKillsInAllGames = games.reduce(
    (acc, game) => {
      game.teams.forEach((team) => {
        acc.dragons += team.match_team_stats.dragonKills ?? 0;
        acc.grubs += team.match_team_stats.hordeKills ?? 0;
      });
      return acc;
    },
    { dragons: 0, grubs: 0 },
  );

  const stats = games.reduce<AggregationAccumulator>((acc, game) => {
    const currentTeam = game.teams.find((team) => team.match_team_stats.teamId === teamId);
    if (!currentTeam) return acc;

    const teamStats = currentTeam.match_team_stats;
    const teamParticipants = game.participants.filter((participant) => participant.teamId === teamStats.teamId);

    const teamTotalsForGame = teamParticipants.reduce(
      (sum, player) => {
        sum.kills += player.kills ?? 0;
        sum.deaths += player.deaths ?? 0;
        sum.assists += player.assists ?? 0;
        sum.gold += player.goldEarned ?? 0;
        sum.damage += Number(player.totalDamageDealtToChampions ?? 0);
        sum.visionScore += player.visionScore ?? 0;
        return sum;
      },
      { kills: 0, deaths: 0, assists: 0, gold: 0, damage: 0, visionScore: 0 },
    );

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

    if (teamStats.firstDragon) acc.firstDragonCount += 1;
    if (teamStats.firstBaron) acc.firstBaronCount += 1;
    if (teamStats.firstInhibitor) acc.firstInhibitorCount += 1;

    if (teamStats.riotTeamId === 100) {
      acc.blueSideGames += 1;
      if (teamStats.win) acc.blueSideWins += 1;
    } else {
      acc.redSideGames += 1;
      if (teamStats.win) acc.redSideWins += 1;
    }

    let gotFirstBlood = false;
    let gotFirstTower = false;

    teamParticipants.forEach((player) => {
      if (player.firstBloodKill || player.firstBloodAssist) gotFirstBlood = true;
      if (player.firstTowerKill || player.firstTowerAssist) gotFirstTower = true;

      const lane = player.teamPosition as LaneRole | null;
      if (lane && LANE_ROLES.includes(lane)) {
        acc.laneDistribution[lane].gold += safeDivide(player.goldEarned ?? 0, teamTotalsForGame.gold);
        acc.laneDistribution[lane].damage += safeDivide(Number(player.totalDamageDealtToChampions ?? 0), teamTotalsForGame.damage);
        acc.laneDistribution[lane].vision += safeDivide(player.visionScore ?? 0, teamTotalsForGame.visionScore);
      }

      const riotIdKey = normalizeRiotId(player.riotIdGameName, player.riotIdTagLine);
      let rosterKey = player.playerPuuid ? rosterByPuuid.get(player.playerPuuid) : rosterByRiotId.get(riotIdKey);

      if (!rosterKey) {
        const fallbackName = player.riotIdGameName ?? "Unknown";
        const fallbackTag = player.riotIdTagLine ?? "Unknown";
        const fallbackKey = player.playerPuuid || `${fallbackName}-${fallbackTag}`;
        if (!acc.rosterStats[fallbackKey]) {
          acc.rosterStats[fallbackKey] = createRosterAccumulator(fallbackName, fallbackTag);
          if (player.playerPuuid) rosterByPuuid.set(player.playerPuuid, fallbackKey);
          rosterByRiotId.set(normalizeRiotId(fallbackName, fallbackTag), fallbackKey);
        }
        rosterKey = fallbackKey;
      }

      const rosterPlayer = acc.rosterStats[rosterKey];
      rosterPlayer.gamesPlayed += 1;
      if (player.win) rosterPlayer.wins += 1;
      rosterPlayer.totalKills += player.kills ?? 0;
      rosterPlayer.totalDeaths += player.deaths ?? 0;
      rosterPlayer.totalAssists += player.assists ?? 0;
      const role = player.teamPosition ?? "UNKNOWN";
      rosterPlayer.roleCounts[role] = (rosterPlayer.roleCounts[role] ?? 0) + 1;
    });

    if (gotFirstBlood) acc.firstBloodCount += 1;
    if (gotFirstTower) acc.firstTowerCount += 1;

    return acc;
  }, createEmptyAccumulator(rosterStats));

  const totalGames = stats.totalGames;
  const totalDurationMinutes = safeDivide(stats.totalGameDuration, 60);

  const roster = Object.values(stats.rosterStats)
    .map((player) => {
      const gamesPlayed = player.gamesPlayed;
      const roles = Object.entries(player.roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([role]) => role);

      return {
        summonerName: player.summonerName,
        gamesPlayed,
        winrate: safeDivide(player.wins * 100, gamesPlayed),
        kda: safeDivide(player.totalKills + player.totalAssists, player.totalDeaths === 0 ? 1 : player.totalDeaths),
        avgKills: safeDivide(player.totalKills, gamesPlayed),
        avgDeaths: safeDivide(player.totalDeaths, gamesPlayed),
        avgAssists: safeDivide(player.totalAssists, gamesPlayed),
        roles,
        riotIdGameName: player.gameName,
        riotIdTagLine: player.tagLine,
      };
    })
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  const laneDistribution = LANE_ROLES.reduce<Record<string, LaneDistribution>>((distribution, lane) => {
    const outputLane = lane === "UTILITY" ? "SUPPORT" : lane;
    const laneTotals = stats.laneDistribution[lane];
    distribution[outputLane] = {
      gold: safeDivide(laneTotals.gold * 100, totalGames),
      damage: safeDivide(laneTotals.damage * 100, totalGames),
      vision: safeDivide(laneTotals.vision * 100, totalGames),
    };
    return distribution;
  }, {});

  const goldDistribution: Record<string, number> = {};
  const damageDistribution: Record<string, number> = {};
  const visionDistribution: Record<string, number> = {};

  Object.entries(laneDistribution).forEach(([lane, values]) => {
    goldDistribution[lane] = values.gold;
    damageDistribution[lane] = values.damage;
    visionDistribution[lane] = values.vision;
  });

  return {
    totalGames,
    wins: stats.wins,
    losses: totalGames - stats.wins,
    winrate: safeDivide(stats.wins * 100, totalGames),
    avgGameDuration: safeDivide(stats.totalGameDuration, totalGames),
    kda: safeDivide(stats.totalKills + stats.totalAssists, stats.totalDeaths === 0 ? 1 : stats.totalDeaths),
    avgKills: safeDivide(stats.totalKills, totalGames),
    avgDeaths: safeDivide(stats.totalDeaths, totalGames),
    avgAssists: safeDivide(stats.totalAssists, totalGames),
    avgVisionScore: safeDivide(stats.totalVisionScore, totalGames),
    avgDamagePerMin: safeDivide(stats.totalDamage, totalDurationMinutes),
    avgGoldPerMin: safeDivide(stats.totalGold, totalDurationMinutes),
    avgBarons: safeDivide(stats.totalBarons, totalGames),
    avgDragons: safeDivide(stats.totalDragons, totalGames),
    avgTowers: safeDivide(stats.totalTowers, totalGames),
    avgInhibitors: safeDivide(stats.totalInhibitors, totalGames),
    avgGrubs: safeDivide(stats.totalGrubs, totalGames),
    avgAtahkhan: safeDivide(stats.totalAtakhan, totalGames),
    avgHeralds: safeDivide(stats.totalHeralds, totalGames),
    firstBloodRate: safeDivide(stats.firstBloodCount * 100, totalGames),
    firstTowerRate: safeDivide(stats.firstTowerCount * 100, totalGames),
    firstDragonRate: safeDivide(stats.firstDragonCount * 100, totalGames),
    firstBaronRate: safeDivide(stats.firstBaronCount * 100, totalGames),
    firstInhibitorRate: safeDivide(stats.firstInhibitorCount * 100, totalGames),
    dragonControlRate: safeDivide(stats.totalDragons * 100, totalObjectiveKillsInAllGames.dragons),
    voidGrubControlRate: safeDivide(stats.totalGrubs * 100, totalObjectiveKillsInAllGames.grubs),
    blueSidePerformance: {
      games: stats.blueSideGames,
      wins: stats.blueSideWins,
      winrate: safeDivide(stats.blueSideWins * 100, stats.blueSideGames),
    },
    redSidePerformance: {
      games: stats.redSideGames,
      wins: stats.redSideWins,
      winrate: safeDivide(stats.redSideWins * 100, stats.redSideGames),
    },
    laneDistribution,
    goldDistribution,
    damageDistribution,
    visionDistribution,
    roster,
    customAchievements: teamDetails?.customAchievements ?? [],
  };
};

export default teamStatsAggregation;
