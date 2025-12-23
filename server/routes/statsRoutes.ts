import express, { Request, Response } from "express";
import {
  getGamesForPlayer,
  getGamesForTeam,
  getPlayer,
  getRecentGames,
  getRecentGamesByDivision,
  getSeasons,
  getTeamsBySeason,
} from "../db/queries/statQueries/select";
import { getTeamIdByName } from "../db/queries/select";
import playerStatsAggregation from "../stats/playerStatsAggregation";
import teamStatsAggregation from "../stats/teamStatsAggregation";
import { EventWithTeamsDto } from "./rosterRoutes";
import {
  getDivisionsForSeason,
  getDivisionsForSelectedSeason,
  getTeamSeasonsByName,
  getPlayerSeasonsByPuuid,
} from "../db/queries/select";

const statRoutes = express.Router();

interface TeamResponse {
  divisions: {
    id: number;
    seasonId: number;
    divisionName: string;
    createdAt: string | null;
    eventId: number | null;
  };
  teams: {
    id: number;
    divisionId: number | null;
    teamName: string;
    teamTag: string | null;
    active: boolean;
    createdAt: string | null;
    formerTeam: number | null;
    logo?: string;
  } | null;
}
// Get recent game stats from db
statRoutes.get("/api/games/recent/:amount", async (req: Request, res: Response) => {
  try {
    const amount: number = Number(req.params.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount parameter" });
    }
    const response = await getRecentGames(amount);
    if (response.length <= 0) {
      return res.status(404).json({ error: "Matches Not Found" });
    }
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get recent games for a division
statRoutes.get("/api/games/division/:divisionId/:amount", async (req: Request, res: Response) => {
  try {
    const divisionId: number = Number(req.params.divisionId);
    const amount: number = Number(req.params.amount);
    if (isNaN(divisionId) || isNaN(amount) || divisionId <= 0 || amount <= 0) {
      return res.status(400).json({ error: "Invalid parameters" });
    }
    const response = await getRecentGamesByDivision(amount, divisionId);
    if (response.length <= 0) {
      return res.status(404).json({ error: "Matches Not Found" });
    }
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all games for a team
statRoutes.get("/api/games/team/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId: number = Number(req.params.teamId);
    if (isNaN(teamId) || teamId <= 0) {
      return res.status(400).json({ error: "Invalid team ID" });
    }
    const response = await getGamesForTeam(teamId);
    if (response.length <= 0) {
      return res.status(404).json({ error: "Matches Not Found" });
    }
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all games for a player
statRoutes.get("/api/games/player/:summonerName/:tagline", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const seasonId = req.query.seasonId ? Number(req.query.seasonId) : undefined;

    const puuidResponse = await getPlayer(summonerName, tagline);
    if (!puuidResponse || !puuidResponse.players.puuid) {
      return res.status(404).json({ error: "Player Not Found" });
    }

    const response = await getGamesForPlayer(puuidResponse.players.puuid, seasonId);
    if (response.length <= 0) {
      return res.status(404).json({ error: "Matches Not Found" });
    }

    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get player overall stats by summonerID
statRoutes.get("/api/player/summoner/:summonerName/:tagline", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const seasonId = req.query.seasonId ? Number(req.query.seasonId) : undefined;

    const playerResponse = await getPlayer(summonerName, tagline);
    if (!playerResponse) {
      return res.status(404).json({ error: "Player Not Found" });
    }
    const puuid = playerResponse.players.puuid;
    const overallStats = await playerStatsAggregation(puuid, seasonId);
    if (!overallStats) {
      return res.status(404).json({ error: "Player Stats Not Found" });
    }
    return res.json({ ...playerResponse.team, ...overallStats });
  } catch (err: any) {
    console.error("Error fetching player stats by name:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get player stats by puuid
statRoutes.get("/api/player/puuid/:puuid", async (req: Request, res: Response) => {
  try {
    const puuid: string = req.params.puuid;
    const seasonId = req.query.seasonId ? Number(req.query.seasonId) : undefined;

    const overallStats = await playerStatsAggregation(puuid, seasonId);
    if (!overallStats) {
      return res.status(404).json({ error: "Player Stats Not Found" });
    }
    return res.json(overallStats);
  } catch (err: any) {
    console.error("Error fetching player stats puuid:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

statRoutes.get("/api/player/:puuid/seasons", async (req: Request, res: Response) => {
  try {
    const puuid = req.params.puuid;
    const seasons = await getPlayerSeasonsByPuuid(puuid);
    res.json(seasons);
  } catch (error) {
    console.error("Error fetching player seasons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get team overall stats
statRoutes.get("/api/team/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId: number = Number(req.params.teamId);
    if (isNaN(teamId) || teamId <= 0) {
      return res.status(400).json({ error: "Invalid team ID" });
    }
    const overallStats = await teamStatsAggregation(teamId);
    if (!overallStats) {
      return res.status(404).json({ error: "Team Stats Not Found" });
    }
    return res.json(overallStats);
  } catch (err: any) {
    console.error("Error fetching team stats:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get team overall stats by team name (resolves active team id then aggregates)
statRoutes.get("/api/team/name/:teamName", async (req: Request, res: Response) => {
  try {
    const teamName: string = decodeURIComponent(req.params.teamName);
    if (!teamName) {
      return res.status(400).json({ error: "Invalid team name" });
    }
    const teamId = await getTeamIdByName(teamName);
    if (!teamId) {
      return res.status(404).json({ error: "Team Not Found" });
    }
    const overallStats = await teamStatsAggregation(teamId);
    if (!overallStats) {
      return res.status(404).json({ error: "Team Stats Not Found" });
    }
    let teamLogo: string | null = null;
    try {
      const divisions = await getDivisionsForSeason();
      for (const div of divisions) {
        if (!div.eventId) continue;
        try {
          const dennysApiResponse = await fetch(
            `https://dennys.lowbudgetlcs.com/api/v1/event/${div.eventId}/teams`
          );
          if (!dennysApiResponse.ok) continue;
          const dennysApiEventData: EventWithTeamsDto = await dennysApiResponse.json();
          const matched = dennysApiEventData.teams.find(
            (t) => t.name.toLowerCase() === teamName.toLowerCase()
          );
          if (matched?.logoName) {
            teamLogo = matched.logoName;
            break;
          }
        } catch (logoErr: any) {
          console.warn("Error fetching logo from Dennys for division", div.eventId, logoErr.message);
        }
      }
    } catch (err) {
      console.warn("Error getting divisions or logos:", err);
    }
    return res.json({ teamId, overallStats, logo: teamLogo });
  } catch (err: any) {
    console.error("Error fetching team stats by name:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if a player is in the database
statRoutes.get("/api/player/check/:summonerName/:tagline", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const playerResponse = await getPlayer(summonerName, tagline);
    if (!playerResponse) {
      return res.status(404).json({ found: false });
    }
    return res.status(200).json({ found: true, puuid: playerResponse.players.puuid });
  } catch (err: any) {
    console.error("Error checking player existence:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

statRoutes.get("/api/seasons", async (req: Request, res: Response) => {
  try {
    const response = await getSeasons();
    if (response.length <= 0) {
      return res.status(404).json({ error: "Seasons Not Found" });
    }
    return res.json(response);
  } catch (err: any) {
    console.error("Error getting all seasons:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Cache map for teams and divisions for a season
const seasonCache = new Map<number, any>();
statRoutes.get("/api/seasons/:seasonId", async (req: Request, res: Response) => {
  // 10 hours
  const seasonCacheTTL = 10 * 60 * 60 * 1000;
  if (seasonCache.has(Number(req.params.seasonId))) {
    return res.status(200).json(seasonCache.get(Number(req.params.seasonId)));
  } else {
    try {
      console.log(`Fetching season data for season ID ${req.params.seasonId} from DB.`);
      const seasonId: number = Number(req.params.seasonId);
      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ error: "Invalid season ID" });
      }
      const teamsResponse: TeamResponse[] = await getTeamsBySeason(seasonId);
      if (teamsResponse.length <= 0) {
        return res.status(404).json({ error: "Season Not Found" });
      }
      // Adds logos from dennys for each
      for (const team of teamsResponse) {
        try {
          if (!team.teams) continue;
          const dennysApiResponse = await fetch(
            `https://dennys.lowbudgetlcs.com/api/v1/event/${team.divisions.eventId}/teams`
          );
          if (dennysApiResponse) {
            const dennysApiEventData: EventWithTeamsDto = await dennysApiResponse.json();
            const matchedTeam = dennysApiEventData.teams.find(
              (t) => t.name.toLowerCase() === team.teams?.teamName.toLowerCase()
            );
            if (matchedTeam) {
              team.teams.logo = matchedTeam.logoName;
            }
          }
        } catch (logoErr: any) {
          console.warn(`Error getting logos: `, logoErr.message);
        }
      }
      const divisionsResponse = await getDivisionsForSelectedSeason(seasonId);
      if (divisionsResponse.length <= 0) {
        return res.status(404).json({ error: "Season Not Found" });
      }
      // Set cache to avoid repeated calls within TTL
      seasonCache.set(seasonId, { teams: teamsResponse, divisions: divisionsResponse });
      setTimeout(() => {
        seasonCache.delete(seasonId);
      }, seasonCacheTTL);
      console.log(`Cached season data for season ID ${seasonId} for 10 hours.`);
      return res.json({ teams: teamsResponse, divisions: divisionsResponse });
    } catch (err: any) {
      console.error("Error getting season by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

statRoutes.get("/api/teams/:teamName/seasons", async (req: Request, res: Response) => {
  try {
    const teamName = req.params.teamName;
    const seasons = await getTeamSeasonsByName(teamName);
    res.json(seasons);
  } catch (error) {
    console.error("Error fetching team seasons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default statRoutes;
