import express, { Request, Response } from "express";
import getMatchData from "../matchHistory/getMatchData";

const matchRoutes = express.Router();

matchRoutes.get("/api/match/:riotMatchId", async (req: Request, res: Response) => {
  try {
    const riotMatchId = req.params.riotMatchId;
    const response = await getMatchData("NA1_" + riotMatchId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json(response);
    }
  } catch (err: any) {
    console.error("Error while checking tournament code:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default matchRoutes;
