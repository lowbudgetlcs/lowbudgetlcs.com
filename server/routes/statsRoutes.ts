import express, { Request, Response } from "express";
import {
  getGamesForTeam,
  getRecentGames,
  getRecentGamesByDivision,
} from "../db/queries/statQueries/select";

const statRoutes = express.Router();

// Get recent game stats from db
statRoutes.get("/api/games/recent/:amount", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const response = await getRecentGames(5);
    if (response.length <= 0) {
      res.status(404).json({ error: "Matches Not Found" });
    }
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default statRoutes;

// Get all games for a team
statRoutes.get("/api/games/team/:teamId", async (req: Request, res: Response) => {
  try {
    const teamId: number = Number(req.params.teamId);
    const response = await getGamesForTeam(teamId);
    if (response.length <= 0) {
      res.status(404).json({ error: "Matches Not Found" });
    }
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get recent games for a division
statRoutes.get("/api/games/division/:divisionId/:amount", async (req: Request, res: Response) => {
  try {
    const divisionId: number = Number(req.params.divisionId);
    const amount: number = Number(req.params.amount);
    const response = await getRecentGamesByDivision(amount, divisionId);
    if (response.length <= 0) {
      res.status(404).json({ error: "Matches Not Found" });
    }
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
