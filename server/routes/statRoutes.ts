import express, { Request, Response } from "express";
import seriesHandler from "../statHandlers/seriesHandler";
import matchHandler from "../statHandlers/matchHandler";
const statRoutes = express.Router();

// Player Stats from DB
// app.get(
//   "/api/stats/player/:summonerName",
//   async (req: Request, res: Response) => {
//     try {
//       const summonerName: string = req.params.summonerName;
//       const response = await getAllPlayerGames(summonerName);
//       res.json(response);
//     } catch (err: any) {
//       if (err.message === "No Player Found") {
//         res.status(404).json({ error: "Player not found" });
//       } else {
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   }
// );

// Team Stats from DB
// app.get("/api/stats/team/:teamID", async (req: Request, res: Response) => {
//   try {
//     console.log("pinged");
//     const teamID: number = Number(req.params.teamID);
//     console.log(teamID);
//     const response = await getAllTeamGames(teamID);
//     res.json(response);
//   } catch (err: any) {
//     if (err.message === "No Team Found") {
//       res.status(404).json({ error: "Team not found" });
//     } else {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// });

statRoutes.get(
  "/api/matchhistory/series/:seriesID",
  async (req: Request, res: Response) => {
    try {
      const seriesID: number = Number(req.params.seriesID);
      const response = await seriesHandler(seriesID);
      res.json(response);
    } catch (err: any) {
      if (err.message === "Series Not Found") {
        res.status(404).json({ error: "Series Not Found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

statRoutes.get(
  "/api/matchhistory/match/:shortcode",
  async (req: Request, res: Response) => {
    try {
      const shortcode: string = req.params.shortcode;
      const response = await matchHandler(shortcode);
      res.json(response);
    } catch (err: any) {
      if (err.message === "Match Not Found") {
        res.status(404).json({ error: "Match Not Found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);
export default statRoutes;
