import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import draftRoutes from "./routes/draftRoutes";
import twitchRoutes from "./routes/twitchRoutes";
import { getTwitchConfig } from "./services/twitchService";

const app = express();
const port = 8080;
const isProduction = process.env.PRODUCTION === "production";

// Validate twitch env variables present
try {
  getTwitchConfig();
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}

// Cors options. will always be in production on live server
const corsOptions = {
  origin: isProduction ? "https://lowbudgetlcs.com" : "*",
  methods: "GET",
};

//Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2000, // Limit each IP to 2000 requests per windowMs
});


// Middleware
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

app.use("/draft", draftRoutes);
app.use("/twitch", twitchRoutes);
app.listen(port, () => {
  console.log("Server started on port " + port);
});
