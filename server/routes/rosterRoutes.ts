import express, { Request, Response } from "express";
const rosterRoutes = express.Router();
import { getRosterData } from "../db/queries/select";

rosterRoutes.get("/api/rosterdata", async (req: Request, res: Response) => {
  try {
    const response = await getRosterData();
    res.json(response);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default rosterRoutes;
