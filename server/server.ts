import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { getDivisions, getPlayers, getTeams } from "./db/queries/select";
import getAllGames from "./stats";
const app = express();
const port = 8080;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const clientID: string | undefined = process.env.CLIENT_ID;
const isProduction = process.env.PRODUCTION === "production";
//Check if ID and secret in env
if (!clientID || !clientSecret) {
  console.error("Missing Twitch client ID or secret.");
  process.exit(1);
}
//Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2000, // Limit each IP to 1000 requests per windowMs
});
app.use("/api/", apiLimiter);

//! Add Cors Options on prod
const corsOptions = {
  origin: isProduction ? "https://lowbudgetlcs.com" : "*",
  methods: "GET",
};

app.use(cors(corsOptions));

if (isProduction) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

app.get("/api/checklive", async (req: Request, res: Response) => {
  try {
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

app.get("/api/getPlayers", async (req: Request, res: Response) => {
  try {
    const response = await getPlayers();
    res.json(response);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getTeams", async (req: Request, res: Response) => {
  try {
    const response = await getTeams();
    res.json(response);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getDivisions", async (req: Request, res: Response) => {
  try {
    const response = await getDivisions();
    res.json(response);
  } catch (err: any) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

let twitchToken: string | undefined;
let tokenExpiration: Date | undefined;

async function getTwitchToken(clientID: string, clientSecret: string) {
  try {
    if (!twitchToken || !tokenExpiration || new Date() >= tokenExpiration) {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
          params: {
            client_id: clientID,
            client_secret: clientSecret,
            grant_type: "client_credentials",
          },
        }
      );

      twitchToken = response.data.access_token;
      tokenExpiration = new Date();
      tokenExpiration.setSeconds(
        tokenExpiration.getSeconds() + response.data.expires_in
      );

      console.log("New token acquired:", twitchToken);
      console.log("Token expiration date:", tokenExpiration);
    }
    return twitchToken;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
}

async function checkIfLive(clientID: string, accessToken: string) {
  let isLive;
  try {
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      headers: {
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user_login: "lowbudgetlcs",
      },
    });
    if (response.data.data.length > 0) {
      isLive = true;
    } else {
      isLive = false;
    }
    return isLive;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
}

// Stats Api Routes
app.get("/api/stats/:summonerName", async (req: Request, res: Response) => {
  try {
    const summonerName: string = req.params.summonerName;
    const response = await getAllGames(summonerName);
    res.json(response);
  } catch (err: any) {
    if (err.message === "No Player Found") {
      return res.status(404).json({ error: "Player not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});
