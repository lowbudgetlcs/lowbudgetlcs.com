import express, { Request, Response } from "express";
const twitchRoutes = express.Router();

import { checkIfLive, getTwitchConfig, getTwitchToken } from "../services/twitchService";

// Twitch Life check. Runs every time the website is opened
twitchRoutes.get("/twitch/checklive", async (req: Request, res: Response) => {
  try {
    const { clientID, clientSecret } = getTwitchConfig();
    if (!clientID || !clientSecret) {
      throw new Error("Missing Twitch client ID or secret.");
    }
    const accessToken = await getTwitchToken(clientID, clientSecret);
    if (!accessToken) {
      throw new Error("Missing Access Token");
    }
    const isLive = await checkIfLive(clientID, accessToken);
    res.json({ isLive });
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default twitchRoutes;
