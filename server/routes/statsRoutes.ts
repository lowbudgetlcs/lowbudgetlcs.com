
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