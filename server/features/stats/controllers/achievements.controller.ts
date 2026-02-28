import { Request, Response } from "express";
import { getAllAchievements } from "../../../db/queries/statQueries/select";

const getAchievements = async (req: Request, res: Response, next: Function) => {
  try {
    const achievements = await getAllAchievements();
    res.json(achievements);
  } catch (err) {
    next(err);
  }
};

const achievementsController = {
  getAchievements,
};

export default achievementsController;