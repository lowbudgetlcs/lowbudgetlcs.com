import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import {
  getDivisions,
  getMatchingShortCode,
  getPlayers,
  getTeams,
} from "./db/queries/select";
import { getAllPlayerGames, getAllTeamGames } from "./stats";
const app = express();
const port = 8080;
const clientSecret: string | undefined = process.env.CLIENT_SECRET;
const clientID: string | undefined = process.env.CLIENT_ID;
const isProduction = process.env.PRODUCTION === "production";

//Check if ID and secret are in env file
if (!clientID || !clientSecret) {
  console.error("Missing Twitch client ID or secret.");
  process.exit(1);
}

//Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs
});
app.use("/api/", apiLimiter);

// Cors options. will always be in production on live server
const corsOptions = {
  origin: isProduction ? "https://lowbudgetlcs.com" : "*",
  methods: "GET",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Checks that host is always connecting securely when in production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

// Twitch Life check. Runs every time the website is opened
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

// TODO: Refactor route to lessen load on server
// Retrieve all players. Currently used by roster only
app.get("/api/getPlayers", async (req: Request, res: Response) => {
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
app.get("/api/getTeams", async (req: Request, res: Response) => {
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

// New twitch token aquirer
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

// Twitch Live check for lblcs. Runs every time the website is opened
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

// Player Stats from DB
app.get(
  "/api/stats/player/:summonerName",
  async (req: Request, res: Response) => {
    try {
      const summonerName: string = req.params.summonerName;
      const response = await getAllPlayerGames(summonerName);
      res.json(response);
    } catch (err: any) {
      if (err.message === "No Player Found") {
        res.status(404).json({ error: "Player not found" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

// Team Stats from DB
app.get("/api/stats/team/:teamID", async (req: Request, res: Response) => {
  try {
    console.log("pinged");
    const teamID: number = Number(req.params.teamID);
    console.log(teamID);
    const response = await getAllTeamGames(teamID);
    res.json(response);
  } catch (err: any) {
    if (err.message === "No Team Found") {
      res.status(404).json({ error: "Team not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(port, () => {
  console.log("Server started on port " + port);
});

app.get(
  "/api/draft/checkTournamentCode/:code",
  async (req: Request, res: Response) => {
    try {
      console.log("checking for tourneyID");
      const shortCode = req.params.code;
      const response = await getMatchingShortCode(shortCode);
      if (response) {
        res.status(200).json({ valid: true });
      } else {
        res.status(200).json({ valid: false });
      }
    } catch (err: any) {
      console.error("Error while checking tournament code:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//TODO move this to top of file
// Imports for socket.io
import { Server } from "socket.io";
import { draftConnection } from "./draftHandler";
const io = new Server(8070, {
  cors: {
    origin: "*",
  },
});

interface DraftProps {
  blueCode: string;
  redCode: string;
  specCode: string;
  blueName: string;
  redName: string;
  tournamentID: string | undefined;
}
// Draft Lobby Connection
app.get("/draft/:lobbyCode", async (req: Request, res: Response) => {
  try {
    let side: string;
    console.log("connecting To Server");
    const lobbyCode: string = req.params.lobbyCode;
    console.log("Recieved Lobby Code: ", lobbyCode);

    async function readDraftFile() {
      fs.readFile("../draft/draft.json", "utf-8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File content:", data);
        const draft: DraftProps = JSON.parse(data);
        if (draft.blueCode === lobbyCode) {
          res.send(200).json({ message: "You are Blue Side" });
        } else if (draft.redCode === lobbyCode) {
          res.send(200).json({ message: "You are Red Side" });
        } else if (draft.specCode === lobbyCode) {
          res.send(200).json({ message: "You are Spec Side" });
        } else res.send(404).json({ error: "Incorrect Code Given" });
      });
    }
    await readDraftFile();
    draftConnection(io);
  } catch (err: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Draft Lobby Creation
const generateRandomString = () => Math.random().toString(36).substring(7);
// !Remove when using DB
import fs from "fs";
import path from "path";
app.post("/api/draft/createLobby", async (req: Request, res: Response) => {
  try {
    console.log("Beginning call to server for Draft Creation");
    // Pull nick names and tournament ID from request (if there is one)
    const { redName, blueName, tournamentID } = req.body;

    // Validate required fields
    if (!redName || !blueName) {
      return res
        .status(400)
        .json({ error: "Both redName and blueName are required" });
    }

    console.log("Received Data:", { redName, blueName, tournamentID });

    // Generate unique URLs for the draft
    let blueCode, redCode, specCode;
    blueCode = generateRandomString(); //!Temp code until below is uncommented
    redCode = generateRandomString();
    specCode = generateRandomString();

    // !Uncomment when using DB
    // if (tournamentID) {
    //   while (true) {
    //     blueCode = generateRandomString();
    //     redCode = generateRandomString();
    //     specCode = generateRandomString();

    //     console.log("Checking if URLs are unique...");
    //     const urlResponse = await checkDBForURL(blueCode, redCode, specCode);
    //     if (urlResponse.length === 0) break;

    //     console.log("URLs not unique, retrying...");
    //   }
    // }

    // Create the draft object
    const draft = {
      blueCode: blueCode,
      redCode: redCode,
      specCode: specCode,
      redName,
      blueName,
      tournamentID,
    };

    // TODO: Move from writing on a file to using a database
    const filePath = path.join(`../draft`, "draft.json");
    const jsonString = JSON.stringify(draft, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf-8");
    console.log(`Draft saved to ${filePath}`);

    console.log("Draft Created:", draft);

    // !Uncomment when using DB
    // Save to the database
    // await insertDrafts(draft)

    // Success Response
    res.status(201).json({
      message: "Draft lobby created successfully",
      draft: {
        blueCode,
        redCode,
        specCode,
      },
    });
  } catch (err) {
    console.error("Error in Draft Creation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
