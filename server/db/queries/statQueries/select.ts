import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../..";
import {
  divisionsInWebsite,
  draftLobbies,
  draftLobbiesInWebsite,
  matchesInWebsite,
  matchParticipantsInWebsite,
  matchTeamStatsInWebsite,
  playersInWebsite,
  playerTeamHistoryInWebsite,
  seasonsInWebsite,
  teamsInWebsite,
} from "../../schema";

export const getRecentGames = async (amount: number) => {
  try {
    const recentMatches = await db
      .select()
      .from(matchesInWebsite)
      .orderBy(desc(matchesInWebsite.gameEndTimeStamp))
      .limit(amount);

    if (recentMatches.length === 0) {
      return [];
    }

    const matchIds = recentMatches.map((m) => m.matchId);

    const allTeamStats = await db
      .select()
      .from(matchTeamStatsInWebsite)
      .leftJoin(
        teamsInWebsite,
        eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)
      ) // Join to get team names/tags
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const finalResult = recentMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );

      const participantsForMatch = allParticipants.filter(
        (p) => p.matchId === match.matchId
      );
      return {
        ...match,
        teams: teamsForMatch,
        participants: participantsForMatch,
      };
    });

    return finalResult;
  } catch (err) {
    console.error("Error in getRecentGames: ", err);
    return [];
  }
};

export const getGamesForTeam = async (teamId: number) => {
  try {
    const teamMatchStats = await db
      .select({ matchId: matchTeamStatsInWebsite.matchId,
        tournamentCodes: matchesInWebsite.tournamentCode
       })
      .from(matchTeamStatsInWebsite)
      .where(eq(matchTeamStatsInWebsite.teamId, teamId))
      .leftJoin(
        matchesInWebsite,
        eq(matchTeamStatsInWebsite.matchId, matchesInWebsite.matchId)
      );

    if (teamMatchStats.length === 0) {
      return [];
    }

    const matchIds = teamMatchStats.map((ts) => ts.matchId);
    const teamMatches = await db
      .select()
      .from(matchesInWebsite)
      .where(inArray(matchesInWebsite.matchId, matchIds))
      .orderBy(desc(matchesInWebsite.gameEndTimeStamp)); // Order by most recent

    const allTeamStats = await db
      .select()
      .from(matchTeamStatsInWebsite)
      .leftJoin(
        teamsInWebsite,
        eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)
      )
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

      const tournamentCodes: string[] = Array.from(
      new Set(
        teamMatches
          .map((match) => match.tournamentCode)
          .filter((c): c is string => !!c)
      )
    );
    const draftCodes = await db
      .select({
        draftCode: draftLobbiesInWebsite.lobbyCode,
        fearlessCode: draftLobbiesInWebsite.fearlessCode,
        tournamentCode: draftLobbiesInWebsite.shortcode,
      })
      .from(draftLobbiesInWebsite)
      .leftJoin(
        matchesInWebsite,
        eq(draftLobbiesInWebsite.shortcode, matchesInWebsite.tournamentCode)
      )
      .where(inArray(draftLobbiesInWebsite.shortcode, tournamentCodes));


    const finalResult = teamMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );
      const participantsForMatch = allParticipants.filter(
        (p) => p.matchId === match.matchId
      );
      const draftCodeForMatch = draftCodes.find(
        (draft) => draft.tournamentCode === match.tournamentCode
      );
      return {
        ...match,
        teams: teamsForMatch,
        participants: participantsForMatch,
        draftCode: draftCodeForMatch?.draftCode,
        fearlessCode: draftCodeForMatch?.fearlessCode,
      };
    });

    return finalResult;
  } catch (err) {
    console.error("Error in getGamesForTeam: ", err);
    return [];
  }
};

export const getPlayer = async (summonerName: string, tagline: string) => {
  try {
    const player = await db
      .select()
      .from(playersInWebsite)
      .where(
        and(
          eq(
            sql`lower(${playersInWebsite.summonerName})`,
            summonerName.toLowerCase()
          ),
          eq(sql`lower(${playersInWebsite.tagLine})`, tagline.toLowerCase())
        )
      )
      .limit(1);
    return player[0] || null;
  } catch (err) {
    console.error("Error in getPlayer: ", err);
    return null;
  }
};

export const getRecentGamesByDivision = async (
  amount: number,
  divisionId: number
) => {
  try {
    const recentMatches = await db
      .select()
      .from(matchesInWebsite)
      .where(eq(matchesInWebsite.divisionId, divisionId))
      .orderBy(desc(matchesInWebsite.gameEndTimeStamp))
      .limit(amount);

    if (recentMatches.length === 0) {
      return [];
    }

    const matchIds = recentMatches.map((m) => m.matchId);

    const allTeamStats = await db
      .select()
      .from(matchTeamStatsInWebsite)
      .leftJoin(
        teamsInWebsite,
        eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)
      ) // Join to get team names/tags
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const finalResult = recentMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );

      const participantsForMatch = allParticipants.filter(
        (p) => p.matchId === match.matchId
      );
      return {
        ...match,
        teams: teamsForMatch,
        participants: participantsForMatch,
      };
    });

    return finalResult;
  } catch (err) {
    console.error("Error in getRecentGamesByDivision: ", err);
    return [];
  }
};

export const getGamesForPlayer = async (puuid: string) => {
  try {
    const playerMatches = await db
      .select({
        matchId: matchParticipantsInWebsite.matchId,
        tournamentCodes: matchesInWebsite.tournamentCode,
      })
      .from(matchParticipantsInWebsite)
      .where(eq(matchParticipantsInWebsite.playerPuuid, puuid))
      .leftJoin(
        matchesInWebsite,
        eq(matchParticipantsInWebsite.matchId, matchesInWebsite.matchId)
      );

    const matchIds = playerMatches.map((ts) => ts.matchId);

    const teamMatches = await db
      .select()
      .from(matchesInWebsite)
      .where(inArray(matchesInWebsite.matchId, matchIds))
      .orderBy(desc(matchesInWebsite.gameEndTimeStamp)); // Order by most recent

    const tournamentCodes: string[] = Array.from(
      new Set(
        teamMatches
          .map((m) => m.tournamentCode)
          .filter((c): c is string => !!c)
      )
    );

    const allTeamStats = await db
      .select()
      .from(matchTeamStatsInWebsite)
      .leftJoin(
        teamsInWebsite,
        eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)
      )
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const draftCodes = await db
      .select({
        draftCode: draftLobbiesInWebsite.lobbyCode,
        fearlessCode: draftLobbiesInWebsite.fearlessCode,
        tournamentCode: draftLobbiesInWebsite.shortcode,
      })
      .from(draftLobbiesInWebsite)
      .leftJoin(
        matchesInWebsite,
        eq(draftLobbiesInWebsite.shortcode, matchesInWebsite.tournamentCode)
      )
      .where(inArray(draftLobbiesInWebsite.shortcode, tournamentCodes));

    const finalResult = teamMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );
      const participantsForMatch = allParticipants.filter(
        (p) => p.matchId === match.matchId
      );
      const draftCodeForMatch = draftCodes.find(
        (draft) => draft.tournamentCode === match.tournamentCode
      );
      return {
        ...match,
        teams: teamsForMatch,
        participants: participantsForMatch,
        draftCode: draftCodeForMatch?.draftCode,
        fearlessCode: draftCodeForMatch?.fearlessCode,
      };
    });

    return finalResult;
  } catch (err) {
    console.error("Error in getGamesForPlayer: ", err);
    return [];
  }
};

export const getSeasons = async () => {
  try {
    const seasons = await db.select().from(seasonsInWebsite);
    return seasons;
  } catch (err) {
    console.error("Error in getSeasons: ", err);
    return [];
  }
};

export const getTeamsBySeason = async (seasonId: number) => {
  try {
    const teams = await db
      .select()
      .from(divisionsInWebsite)
      .where(eq(divisionsInWebsite.seasonId, seasonId))
      .leftJoin(
        teamsInWebsite,
        eq(divisionsInWebsite.id, teamsInWebsite.divisionId)
      );
    return teams;
  } catch (err) {
    console.error("Error in getTeamsBySeason: ", err);
    return [];
  }
};

export const getCurrentRosterForTeam = async (teamId: number) => {
  try {
    const roster = await db
      .select({
        puuid: playersInWebsite.puuid,
        summonerName: playersInWebsite.summonerName,
        tagLine: playersInWebsite.tagLine,
      })
      .from(playerTeamHistoryInWebsite)
      .innerJoin(
        playersInWebsite,
        eq(playerTeamHistoryInWebsite.playerPuuid, playersInWebsite.puuid)
      )
      .where(
        and(
          eq(playerTeamHistoryInWebsite.teamId, teamId),
          isNull(playerTeamHistoryInWebsite.endDate)
        )
      );

    return roster;
  } catch (error) {
    console.error("Error in getCurrentRosterForTeam:", error);
    return [];
  }
};