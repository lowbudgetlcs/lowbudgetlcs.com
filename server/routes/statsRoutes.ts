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
import playerStatsAggregation from "../stats/playerStatsAggregation";
import teamStatsAggregation from "../stats/teamStatsAggregation";
import { EventWithTeamsDto } from "./rosterRoutes";
import {
  getDivisionsForSeason,
  getDivisionsForSelectedSeason,
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
statRoutes.get(
  "/api/games/recent/:amount",
  async (req: Request, res: Response) => {
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
  }
);

// Get recent games for a division
statRoutes.get(
  "/api/games/division/:divisionId/:amount",
  async (req: Request, res: Response) => {
    try {
      const divisionId: number = Number(req.params.divisionId);
      const amount: number = Number(req.params.amount);
      if (
        isNaN(divisionId) ||
        isNaN(amount) ||
        divisionId <= 0 ||
        amount <= 0
      ) {
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
  }
);

// Get all games for a team
statRoutes.get(
  "/api/games/team/:teamId",
  async (req: Request, res: Response) => {
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
  }
);

// Get all games for a player
statRoutes.get(
  "/api/games/player/:summonerName/:tagline",
  async (req: Request, res: Response) => {
    try {
      const summonerName: string = req.params.summonerName;
      const tagline: string = req.params.tagline;
      const puuidResponse = await getPlayer(summonerName, tagline);
      if (!puuidResponse || !puuidResponse.puuid) {
        return res.status(404).json({ error: "Player Not Found" });
      }

      const response = await getGamesForPlayer(puuidResponse.puuid);
      if (response.length <= 0) {
        return res.status(404).json({ error: "Matches Not Found" });
      }

      return res.json(response);
    } catch (err: any) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// Get player overall stats by summonerID
statRoutes.get(
  "/api/player/summoner/:summonerName/:tagline",
  async (req: Request, res: Response) => {
    try {
      const summonerName: string = req.params.summonerName;
      const tagline: string = req.params.tagline;
      const playerResponse = await getPlayer(summonerName, tagline);
      if (!playerResponse) {
        return res.status(404).json({ error: "Player Not Found" });
      }
      const puuid = playerResponse.puuid;
      const overallStats = await playerStatsAggregation(puuid);
      if (!overallStats) {
        return res.status(404).json({ error: "Player Stats Not Found" });
      }
      return res.json(overallStats);
    } catch (err: any) {
      console.error("Error fetching player stats by name:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get player stats by puuid
statRoutes.get(
  "/api/player/puuid/:puuid",
  async (req: Request, res: Response) => {
    try {
      const puuid: string = req.params.puuid;
      const overallStats = await playerStatsAggregation(puuid);
      if (!overallStats) {
        return res.status(404).json({ error: "Player Stats Not Found" });
      }
      return res.json(overallStats);
    } catch (err: any) {
      console.error("Error fetching player stats puuid:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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

// Check if a player is in the database
statRoutes.get(
  "/api/player/check/:summonerName/:tagline",
  async (req: Request, res: Response) => {
    try {
      const summonerName: string = req.params.summonerName;
      const tagline: string = req.params.tagline;
      const playerResponse = await getPlayer(summonerName, tagline);
      if (!playerResponse) {
        return res.status(404).json({ found: false });
      }
      return res.status(200).json({ found: true, puuid: playerResponse.puuid });
    } catch (err: any) {
      console.error("Error checking player existence:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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

statRoutes.get(
  "/api/seasons/:seasonId",
  async (req: Request, res: Response) => {
    try {
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
            const dennysApiEventData: EventWithTeamsDto =
              await dennysApiResponse.json();
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
      return res.json({
        divisions: divisionsResponse,
        teams: teamsResponse,
      });
    } catch (err: any) {
      console.error("Error getting season by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default statRoutes;
