import express, { Request, Response } from "express";
const rosterRoutes = express.Router();
import {
    getDivisions,
    getPlayers,
    getTeams,
  } from "../db/queries/select";

// TODO: Refactor route to lessen load on server
// Retrieve all players. Currently used by roster only
rosterRoutes.get("/api/getPlayers", async (req: Request, res: Response) => {
    try {
      const response = await getPlayers();
      res.json(response);
    } catch (err: any) {
      console.error("ERROR:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // TODO: Refactor route to lessen load on server
  // Retrieve all teams. Currently used by roster and showing all team cards for stats
  rosterRoutes.get("/api/getTeams", async (req: Request, res: Response) => {
    try {
      const response = await getTeams();
      res.json(response);
    } catch (err: any) {
      console.error("ERROR:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // TODO: Refactor route to lessen load on server
  // Retrieve all divisions. Currently used by roster only
  rosterRoutes.get("/api/getDivisions", async (req: Request, res: Response) => {
    try {
      const response = await getDivisions();
      res.json(response);
    } catch (err: any) {
      console.error("ERROR:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
export default rosterRoutes