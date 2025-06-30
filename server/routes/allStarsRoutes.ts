import express, { Request, Response } from "express";
const allStarsRoutes = express.Router();
import { getAllStarsPosts } from "../db/queries/select";

allStarsRoutes.get("/api/posts/:seasonId", async (req: Request, res: Response) => {
  try {
    const response = await getAllStarsPosts(Number(req.params.seasonId));
    res.json(response);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default allStarsRoutes;
