import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../..";
import {
  draftLobbies,
  draftLobbiesInWebsite,
  matchesInWebsite,
  matchParticipantsInWebsite,
  matchTeamStatsInWebsite,
  playersInWebsite,
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
      .leftJoin(teamsInWebsite, eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)) // Join to get team names/tags
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const finalResult = recentMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );

      const participantsForMatch = allParticipants.filter((p) => p.matchId === match.matchId);
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
      .select({ matchId: matchTeamStatsInWebsite.matchId })
      .from(matchTeamStatsInWebsite)
      .where(eq(matchTeamStatsInWebsite.teamId, teamId));

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
      .leftJoin(teamsInWebsite, eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id))
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const finalResult = teamMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );
      const participantsForMatch = allParticipants.filter((p) => p.matchId === match.matchId);
      return {
        ...match,
        teams: teamsForMatch,
        participants: participantsForMatch,
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
          eq(sql`lower(${playersInWebsite.summonerName})`, summonerName.toLowerCase()),
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

export const getRecentGamesByDivision = async (amount: number, divisionId: number) => {
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
      .leftJoin(teamsInWebsite, eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id)) // Join to get team names/tags
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const finalResult = recentMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );

      const participantsForMatch = allParticipants.filter((p) => p.matchId === match.matchId);
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
      })
      .from(matchParticipantsInWebsite)
      .where(eq(matchParticipantsInWebsite.playerPuuid, puuid));

    const matchIds = playerMatches.map((ts) => ts.matchId);

    const teamMatches = await db
      .select()
      .from(matchesInWebsite)
      .where(inArray(matchesInWebsite.matchId, matchIds))
      .orderBy(desc(matchesInWebsite.gameEndTimeStamp)); // Order by most recent

    const allTeamStats = await db
      .select()
      .from(matchTeamStatsInWebsite)
      .leftJoin(teamsInWebsite, eq(matchTeamStatsInWebsite.teamId, teamsInWebsite.id))
      .where(inArray(matchTeamStatsInWebsite.matchId, matchIds));

    const allParticipants = await db
      .select()
      .from(matchParticipantsInWebsite)
      .where(inArray(matchParticipantsInWebsite.matchId, matchIds));

    const tournamentCodes = teamMatches.map((ts) => ts.tournamentCode);

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
      .where(eq(draftLobbiesInWebsite.shortcode, matchesInWebsite.tournamentCode));

    const finalResult = teamMatches.map((match) => {
      const teamsForMatch = allTeamStats.filter(
        (ts) => ts.match_team_stats.matchId === match.matchId
      );
      const participantsForMatch = allParticipants.filter((p) => p.matchId === match.matchId);
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
