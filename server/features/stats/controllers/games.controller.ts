import { NextFunction, Request, Response } from "express";
import {
  getGamesForPlayer,
  getGamesForTeam,
  getPlayer,
  getRecentGames,
  getRecentGamesByDivision,
} from "../../../db/queries/statQueries/select";

const getRecentGamesByAmount = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
};

const getRecentGamesByDivisionAndAmount = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
};

const getAllGamesForTeam = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    next(err);
  }
};

const getAllGamesForPlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const seasonId = req.query.seasonId !== undefined ? Number(req.query.seasonId) : undefined;
    if (seasonId !== undefined && (!Number.isInteger(seasonId) || seasonId <= 0)) {
      return res.status(400).json({ error: "Invalid seasonId" });
    }

    const puuidResponse = await getPlayer(summonerName, tagline);
    if (!puuidResponse || !puuidResponse.players.puuid) {
      return res.status(404).json({ error: "Player Not Found" });
    }

    const response = await getGamesForPlayer(puuidResponse.players.puuid, seasonId);
    if (response.length <= 0) {
      return res.status(404).json({ error: "Matches Not Found" });
    }

    return res.json(response);
  } catch (err) {
    next(err);
  }
};

const gamesController = {
  getRecentGamesByAmount,
  getRecentGamesByDivisionAndAmount,
  getAllGamesForTeam,
  getAllGamesForPlayer,
};

export default gamesController;
