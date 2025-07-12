import express, { Request, Response } from "express";

const matchRoutes = express.Router();

matchRoutes.get("api/match/:riotMatchId", async (req: Request, res: Response) => {
        try {
          const riotMatchId = req.params.riotMatchId;
          const response = await getMatchData(riotMatchId);
          if (response) {
            res.status(200).json({ valid: true });
          } else {
            res.status(200).json({ valid: false });
          }
        } catch (err: any) {
          console.error("Error while checking tournament code:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
});
export default matchRoutes;
