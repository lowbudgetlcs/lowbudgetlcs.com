import express, { Request, Response } from "express";
import {
  getGamesForPlayer,
  getGamesForTeam,
  getPlayer,
  getRecentGames,
  getRecentGamesByDivision,
} from "../db/queries/statQueries/select";

const statRoutes = express.Router();

// Get recent game stats from db
statRoutes.get("/api/games/recent/:amount", async (req: Request, res: Response) => {
  try {
    const amount: number = Number(req.params.amount);
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
});
// Get player overall stats
statRoutes.get("/api/player/:summonerName/:tagline", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const playerResponse = await getPlayer(summonerName, tagline);
    if (!playerResponse) {
      return res.status(404).json({ error: "Player Not Found" });
    }
    // TODO: Add logic to get overall stats for the player
    return res.json(playerResponse);
  } catch (err: any) {
    console.error("Error fetching player stats:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
    
});

export default statRoutes;
