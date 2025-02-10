import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import draftRoutes from "./routes/draftRoutes";
import twitchRoutes from "./routes/twitchRoutes";
import { getTwitchConfig } from "./services/twitchService";
import rosterRoutes from "./routes/rosterRoutes";
import { Server } from "socket.io";
import { draftSocket } from "./sockets/draftSocket";

const port = 8080;
const origin = process.env.ORIGIN ?? "*";
// Validate twitch env variables present
getTwitchConfig();

const app = express();
app.use(express.json());

// Middleware
// Cors options. will always be in production on live server
app.use(
  cors({
    origin: origin,
    methods: "GET",
  })
);

//Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 2000, // Limit each IP to 2000 requests per windowMs
  })
);

// Forces website to be https on production
if (process.env.NODE_ENV! === "production") {
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

const server = app.listen(port, () => {
  console.log("Server started on port " + port);
});

const io = new Server(server, {
  cors: {
    origin: origin,
  },
});
// Initialize draftSocket with the io instance
draftSocket(io);
