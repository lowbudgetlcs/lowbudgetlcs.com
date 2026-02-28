import { Request, Response } from "express";
import { getPlayer } from "../../../db/queries/statQueries/select";
import playerStatsAggregation from "../../../stats/playerStatsAggregation";
import { getPlayerSeasonsByPuuid } from "../../../db/queries/select";

const getOverallStatsForPlayer = async (req: Request, res: Response, next: Function) => {
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
  } catch (err) {
    next(err);
  }
};

const getPlayerStatsByPuuid = async (req: Request, res: Response, next: Function) => {
  try {
    const puuid: string = req.params.puuid;
    const seasonId = req.query.seasonId ? Number(req.query.seasonId) : undefined;

    const overallStats = await playerStatsAggregation(puuid, seasonId);
    if (!overallStats) {
      return res.status(404).json({ error: "Player Stats Not Found" });
    }
    return res.json(overallStats);
  } catch (err) {
    next(err);
  }
};

const getPlayerSeasons = async (req: Request, res: Response, next: Function) => {
  try {
    const puuid = req.params.puuid;
    const seasons = await getPlayerSeasonsByPuuid(puuid);
    res.json(seasons);
  } catch (err) {
    next(err);
  }
};

const checkPlayerExists = async (req: Request, res: Response, next: Function) => {
  try {
    const summonerName: string = req.params.summonerName;
    const tagline: string = req.params.tagline;
    const playerResponse = await getPlayer(summonerName, tagline);
    if (!playerResponse) {
      return res.status(404).json({ found: false });
    }
    return res.status(200).json({ found: true, puuid: playerResponse.players.puuid });
  } catch (err) {
    next(err);
  }
};

const playerStatsController = {
  getOverallStatsForPlayer,
  getPlayerStatsByPuuid,
  getPlayerSeasons,
  checkPlayerExists,
};

export default playerStatsController;
