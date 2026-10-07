import { NextFunction, Request, Response } from "express";
import { getChampionList, getUpdates } from "../../../db/queries/select";

const getUpdatesData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = await getUpdates();
    return res.status(200).json(updates);
  } catch (err) {
    next(err);
  }
};

const getChampionData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const championData = await getChampionList();
    return res.status(200).json(championData);
  } catch (err: unknown) {
    next(err);
  }
};

const draftDataController = {
  getUpdatesData,
  getChampionData,
};

export default draftDataController;