import type { getGamesForTeam } from "../../../db/queries/statQueries/select";
import type {
  ChampionPoolRole,
  TeamChampionPlayerPool,
  TeamChampionStat,
  TeamGameTrend,
} from "../types/Team";

type TeamGames = Awaited<ReturnType<typeof getGamesForTeam>>;
type ChampionAccumulator = {
  championName: string;
  championId: number;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
};
type PlayerChampionAccumulator = {
  playerKey: string;
  playerName: string;
  tagLine: string;
  roles: Set<ChampionPoolRole>;
  games: number;
  champions: Map<string, ChampionAccumulator>;
};

const roles: ChampionPoolRole[] = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "SUPPORT"];
const safeDivide = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);

const createChampionAccumulator = (championName: string, championId: number): ChampionAccumulator => ({
  championName,
  championId,
  games: 0,
  wins: 0,
  kills: 0,
  deaths: 0,
  assists: 0,
});

const toChampionStats = (champions: Map<string, ChampionAccumulator>): TeamChampionStat[] =>
  Array.from(champions.values())
    .map((champion) => ({
      championName: champion.championName,
      championId: champion.championId,
      games: champion.games,
      wins: champion.wins,
      winrate: safeDivide(champion.wins * 100, champion.games),
      kda: safeDivide(champion.kills + champion.assists, champion.deaths === 0 ? 1 : champion.deaths),
    }))
    .sort((a, b) => b.games - a.games || a.championName.localeCompare(b.championName));

const teamStatsInsights = (games: TeamGames, teamId: number) => {
  const championsByRole = Object.fromEntries(roles.map((role) => [role, new Map<string, ChampionAccumulator>()])) as Record<
    ChampionPoolRole,
    Map<string, ChampionAccumulator>
  >;
  const championsByPlayer = new Map<string, PlayerChampionAccumulator>();
  const gameTrends: TeamGameTrend[] = [];
  const orderedGames = [...games].sort((a, b) => a.gameEndTimeStamp - b.gameEndTimeStamp);

  orderedGames.forEach((game) => {
    const currentTeam = game.teams.find((team) => team.match_team_stats.teamId === teamId);
    if (!currentTeam) return;

    const teamStats = currentTeam.match_team_stats;
    const teamParticipants = game.participants.filter((participant) => participant.teamId === teamStats.teamId);
    const totals = teamParticipants.reduce(
      (acc, participant) => {
        acc.gold += participant.goldEarned ?? 0;
        acc.damage += Number(participant.totalDamageDealtToChampions ?? 0);
        return acc;
      },
      { gold: 0, damage: 0 },
    );
    const durationMinutes = game.gameDuration / 60;

    gameTrends.push({
      gameNumber: gameTrends.length + 1,
      matchId: game.matchId,
      win: teamStats.win,
      goldPerMin: safeDivide(totals.gold, durationMinutes),
      damagePerMin: safeDivide(totals.damage, durationMinutes),
      dragons: teamStats.dragonKills ?? 0,
      barons: teamStats.baronKills ?? 0,
      towers: teamStats.towerKills ?? 0,
    });

    teamParticipants.forEach((participant) => {
      const championName = participant.championName ?? "Unknown";
      const championId = participant.championId;
      const kills = participant.kills ?? 0;
      const deaths = participant.deaths ?? 0;
      const assists = participant.assists ?? 0;
      const normalizedRole = participant.teamPosition === "UTILITY" ? "SUPPORT" : participant.teamPosition;
      const poolRole = roles.find((role) => role === normalizedRole);

      if (poolRole) {
        const roleChampions = championsByRole[poolRole];
        const roleChampion = roleChampions.get(championName) ?? createChampionAccumulator(championName, championId);
        roleChampion.games += 1;
        if (participant.win) roleChampion.wins += 1;
        roleChampion.kills += kills;
        roleChampion.deaths += deaths;
        roleChampion.assists += assists;
        roleChampions.set(championName, roleChampion);
      }

      const playerName = participant.riotIdGameName ?? participant.summonerName ?? "Unknown";
      const tagLine = participant.riotIdTagLine ?? "";
      const playerKey = participant.playerPuuid || `${playerName.toLowerCase()}#${tagLine.toLowerCase()}`;
      const player = championsByPlayer.get(playerKey) ?? {
        playerKey,
        playerName,
        tagLine,
        roles: new Set<ChampionPoolRole>(),
        games: 0,
        champions: new Map<string, ChampionAccumulator>(),
      };
      const playerChampion = player.champions.get(championName) ?? createChampionAccumulator(championName, championId);
      if (poolRole) player.roles.add(poolRole);
      player.games += 1;
      playerChampion.games += 1;
      if (participant.win) playerChampion.wins += 1;
      playerChampion.kills += kills;
      playerChampion.deaths += deaths;
      playerChampion.assists += assists;
      player.champions.set(championName, playerChampion);
      championsByPlayer.set(playerKey, player);
    });
  });

  const championPoolByRole = roles.reduce(
    (pool, role) => {
      pool[role] = toChampionStats(championsByRole[role]);
      return pool;
    },
    {} as Record<ChampionPoolRole, TeamChampionStat[]>,
  );
  const championPoolByPlayer: TeamChampionPlayerPool[] = Array.from(championsByPlayer.values())
    .map((player) => ({
      playerKey: player.playerKey,
      playerName: player.playerName,
      tagLine: player.tagLine,
      roles: roles.filter((role) => player.roles.has(role)),
      games: player.games,
      champions: toChampionStats(player.champions),
    }))
    .sort((a, b) => b.games - a.games || a.playerName.localeCompare(b.playerName));

  return { championPoolByRole, championPoolByPlayer, gameTrends };
};

export default teamStatsInsights;
