import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import {
  checkDBForURL,
  getDivisions,
  getLobbyCodes,
  getMatchingShortCode,
  getPlayers,
  getTeams,
} from "./db/queries/select";
// import { getAllPlayerGames, getAllTeamGames } from "./stats";
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
import {
  checkLiveDraftsForRole,
  draftHandler,
  DraftUsers,
} from "./draftHandler";
import { insertDraft } from "./db/queries/insert";
const io = new Server(8070, {
  cors: {
    origin: "*",
  },
});

export interface DraftProps {
  lobbyCode: string;
  blueCode: string;
  redCode: string;
  blueName: string;
  redName: string;
  tournamentID: string | undefined;
}
interface DraftConnectProps {
  lobbyCode: string;
  role: string;
}
// Draft Lobby Connection
// app.get("/api/draft/:lobbyCode/:sideCode", async (req: Request, res: Response) => {
//   try {

//     console.log("connecting To Server");
//     const side: string = req.params.sideCode
//     const lobbyCode: string = req.params.lobbyCode;
//     console.log("Recieved Lobby Code: ", lobbyCode);
//     console.log("Side connecting: ", side);

//     async function readDraftFile() {
//       fs.readFile("../draft/draft.json", "utf-8", (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.log("File content:", data);
//         const draft: DraftProps = JSON.parse(data);
//         if (draft.blueCode === lobbyCode) {
//           res.send(200).json({ message: "You are Blue Side" });
//         } else if (draft.redCode === lobbyCode) {
//           res.send(200).json({ message: "You are Red Side" });
//         } else if (draft.lobbyCode === lobbyCode) {
//           res.send(200).json({ message: "You are Spec Side" });
//         } else res.send(404).json({ error: "Incorrect Code Given" });
//       });
//     }
//     await readDraftFile();
//   } catch (err: any) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Draft Lobby Creation
const generateRandomString = () => Math.random().toString(36).substring(7);

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
    let blueCode, redCode, lobbyCode;
    blueCode = generateRandomString();
    redCode = generateRandomString();
    lobbyCode = generateRandomString();

    if (tournamentID) {
      while (true) {
        console.log("Checking if URLs are unique...");
        const urlResponse = await checkDBForURL(blueCode, redCode, lobbyCode);
        if (urlResponse.length === 0) break;

        console.log("URLs not unique, retrying...");
      }
    }
    // Create the draft object
    const draft: DraftProps = {
      lobbyCode: lobbyCode,
      blueCode: blueCode,
      redCode: redCode,
      redName: redName,
      blueName: blueName,
      tournamentID: tournamentID,
    };

    console.log("Draft Created:", draft);

    // Save Draft to Database
    await insertDraft(draft);

    // Success Response
    res.status(201).json({
      draft: {
        lobbyCode,
        blueCode,
        redCode,
      },
    });
  } catch (err) {
    console.error("Error in Draft Creation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
interface LobbyCodeProps {
  lobbyCode: string;
  redCode: string;
  blueCode: string;
}
let currentConnections: number = 0;
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  currentConnections++;

  socket.on(
    "joinDraft",
    async ({
      lobbyCode,
      sideCode,
    }: {
      lobbyCode: string;
      sideCode: string;
    }) => {
      console.log("Server received lobbyCode:", lobbyCode);
      console.log("Server received sideCode:", sideCode);

      try {
        const codeQuery = await getLobbyCodes(lobbyCode);
        if (!codeQuery) {
          socket.emit("error", { message: "Invalid Draft ID" });
          socket.disconnect();
          return;
        }
        const lobbyCodes: LobbyCodeProps = codeQuery

        console.log("Valid LOBBY CODES: ", lobbyCodes)


        // Validate role
        if (lobbyCodes.redCode != sideCode && lobbyCodes.blueCode != sideCode) {
          socket.emit("error", { message: "Role not found or invalid." });
          socket.disconnect();
          return;
        }
        // Rest of code will not run if role or lobby codeinvalid

        // Check and assign role
        const draft = {
          blue: "",
          red: "",
        };
        if (sideCode === lobbyCodes.blueCode) {
          // if (draft.blue) {
          //   socket.emit("error", { message: "Blue side already in use" });
          //   socket.disconnect();
          //   return;
          // }
          draft.blue = socket.id;
        } else if (sideCode === lobbyCodes.redCode) {
          // if (draft.red) {
          //   socket.emit("error", { message: "Red side already in use" });
          //   socket.disconnect();
          //   return;
          // }
          draft.red = socket.id;
        } else if (sideCode === "spectator") {
          socket.emit("Spectator", { message: "spectator" });
        } else {
          socket.emit("error", { message: "Invalid role" });
          socket.disconnect();
          return;
        }

        // Join room
        socket.join(lobbyCode);
        console.log(`${socket.id} joined draft ${lobbyCode} as ${sideCode}`);

        // Notify the client and others
        socket.emit("joinedDraft", { lobbyCode, sideCode });
        io.to(lobbyCode).emit("userJoined", { sideCode, id: socket.id });

        // Handle draft-specific logic
        draftHandler(draft, io, lobbyCode);
      } catch (error) {
        console.error("Error during role assignment:", error);
        socket.emit("error", { message: "Internal server error." });
        socket.disconnect();
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    currentConnections--;
  });
});
