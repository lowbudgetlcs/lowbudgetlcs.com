import { getGamesForTeam } from "../db/queries/statQueries/select";

interface RosterPlayerStat {
    summonerName: string;
    gamesPlayed: number;
    winrate: number;
    kda: number;
    avgKills: number;
    avgDeaths: number;
    avgAssists: number;
}

export interface TeamOverallStats {
    totalGames: number;
    wins: number;
    losses: number;
    winrate: number;
    avgGameDuration: number;
    // Objective Stats
    avgBarons: number;
    avgDragons: number;
    avgTowers: number;
    avgInhibitors: number;
    avgGrubs: number; // Added Grubs
    avgAtakhan: number; // Added Atakhan
    firstBloodRate: number;
    firstTowerRate: number;
    // Roster Breakdown
    roster: RosterPlayerStat[];
}

const teamStatsAggregation = async (teamId: number): Promise<TeamOverallStats | null> => {
    const games = await getGamesForTeam(teamId);
    if (!games || games.length === 0) {
        return null;
    }

    const initialRosterStats: { [key: string]: RosterPlayerStat & { totalKills: number, totalDeaths: number, totalAssists: number, wins: number } } = {};

    const stats = games.reduce((acc, game) => {
        const team = game.teams.find(t => t.match_team_stats.teamId === teamId);
        if (!team) return acc;

        const teamStats = team.match_team_stats;

        // Updates Totals
        acc.totalGames += 1;
        if (teamStats.win) acc.wins += 1;
        acc.totalGameDuration += game.gameDuration;
        acc.totalBarons += teamStats.baronKills ?? 0;
        acc.totalDragons += teamStats.dragonKills ?? 0;
        acc.totalTowers += teamStats.towerKills ?? 0;
        acc.totalInhibitors += teamStats.inhibitorKills ?? 0;
        acc.totalGrubs += teamStats.hordeKills ?? 0; 
        acc.totalAtakhan += teamStats.atakhanKills ?? 0; 

        const teamParticipants = game.participants.filter(p => p.teamId === team.teams?.id);

        let teamGotFirstBlood = false;
        let teamGotFirstTower = false;

        // Updates Roster and check for first objectives
        teamParticipants.forEach(player => {
            if (player.firstBloodKill) teamGotFirstBlood = true;
            if (player.firstTowerKill) teamGotFirstTower = true;

            const name = (player.riotIdGameName ?? 'Unknown') + (player.riotIdTagLine ?? "Unknown");
            if (!acc.rosterStats[name]) {
                acc.rosterStats[name] = {
                    summonerName: name, gamesPlayed: 0, winrate: 0, kda: 0,
                    avgKills: 0, avgDeaths: 0, avgAssists: 0,
                    totalKills: 0, totalDeaths: 0, totalAssists: 0, wins: 0
                };
            }
            const rosterPlayer = acc.rosterStats[name];
            rosterPlayer.gamesPlayed += 1;
            if (player.win) rosterPlayer.wins += 1;
            rosterPlayer.totalKills += player.kills ?? 0;
            rosterPlayer.totalDeaths += player.deaths ?? 0;
            rosterPlayer.totalAssists += player.assists ?? 0;
        });

        if (teamGotFirstBlood) acc.firstBloodCount += 1;
        if (teamGotFirstTower) acc.firstTowerCount += 1;

        return acc;
    }, {
        totalGames: 0,
        wins: 0,
        totalGameDuration: 0,
        totalBarons: 0,
        totalDragons: 0,
        totalTowers: 0,
        totalInhibitors: 0,
        totalGrubs: 0, 
        totalAtakhan: 0,
        firstBloodCount: 0,
        firstTowerCount: 0,
        rosterStats: initialRosterStats,
    });

    const totalGames = stats.totalGames;

    // Final calculations for roster players
    const roster = Object.values(stats.rosterStats).map(player => {
        const games = player.gamesPlayed;
        player.winrate = (player.wins / games) * 100;
        player.avgKills = player.totalKills / games;
        player.avgDeaths = player.totalDeaths / games;
        player.avgAssists = player.totalAssists / games;
        player.kda = (player.totalKills + player.totalAssists) / (player.totalDeaths === 0 ? 1 : player.totalDeaths);
        return player as RosterPlayerStat;
    }).sort((a, b) => b.gamesPlayed - a.gamesPlayed);

    return {
        totalGames: totalGames,
        wins: stats.wins,
        losses: totalGames - stats.wins,
        winrate: (stats.wins / totalGames) * 100,
        avgGameDuration: stats.totalGameDuration / totalGames,
        avgBarons: stats.totalBarons / totalGames,
        avgDragons: stats.totalDragons / totalGames,
        avgTowers: stats.totalTowers / totalGames,
        avgInhibitors: stats.totalInhibitors / totalGames,
        avgGrubs: stats.totalGrubs / totalGames,
        avgAtakhan: stats.totalAtakhan / totalGames,
        firstBloodRate: (stats.firstBloodCount / totalGames) * 100,
        firstTowerRate: (stats.firstTowerCount / totalGames) * 100,
        roster: roster,
    };
};

export default teamStatsAggregation;