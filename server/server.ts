import express from "express";
import cors from "cors";
import http from "http";
import { rateLimit } from "express-rate-limit";
import draftRoutes from "./routes/draftRoutes";
import twitchRoutes from "./routes/twitchRoutes";
import { getTwitchConfig } from "./services/twitchService";
import rosterRoutes from "./routes/rosterRoutes";
import { Server } from "socket.io";
import { draftSocket } from "./draftTool/sockets/draftSocket";
import { fearlessSocket } from "./draftTool/sockets/fearlessSocket";
import matchRoutes from "./routes/matchRoutes";
import allStarsRoutes from "./routes/allStarsRoutes";
import { playerSheetUpdaterService } from "./stats/playerTeamUpdaters/updatePlayersServices/playerSheetUpdaterService";
import schedulePlayerDbUpdate from "./cronJobs/schedulePlayerDbUpdate";
import playerDbNameUpdater from "./stats/playerTeamUpdaters/updatePlayersServices/playerDbNameUpdater";
const app = express();
const port = 8080;
const isProduction = process.env.PRODUCTION === "production";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: isProduction
      ? [
          "https://lowbudgetlcs.com",
          "https://draft.lowbudgetlcs.com",
          "https://dennys.lowbudgetlcs.com",
        ]
      : "*",
  },
});

// Validate twitch env variables present
try {
  getTwitchConfig();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}

// Middleware
// Cors options. will always be in production on live server
const corsOptions = {
  origin: isProduction ? ["https://lowbudgetlcs.com", "https://draft.lowbudgetlcs.com"] : "*",
  methods: ["GET", "POST"],
};

//Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs
});

// const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {

//   const apiKey = process.env.SERVER_API_KEY;

//   const requestApiKey = req.query.api_key;

//   if (!requestApiKey || requestApiKey !== apiKey) {
//     return res.status(401).json({ message: "Invalid or missing API key." });
//   }

//   next();
// };

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/", apiLimiter);

// Forces website to be https on production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
// Routes
app.use("/twitch", twitchRoutes);
app.use("/roster", rosterRoutes);
app.use("/draft", draftRoutes);
app.use("/mh", matchRoutes);
app.use("/allstars", allStarsRoutes);

// Set up namespaces
const draftNamespace = io.of("/draft");
const fearlessNamespace = io.of("/fearless");

// Initialize draftSocket with the io instance
draftSocket(draftNamespace);
fearlessSocket(fearlessNamespace);

// Cron Jobs
// schedulePlayerDbUpdate();
playerDbNameUpdater();

server.listen(port, () => {
  console.log("Server started on port " + port);
});
