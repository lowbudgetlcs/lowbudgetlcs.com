import express from "express";
import gamesController from "../features/stats/controllers/games.controller";
import playerStatsController from "../features/stats/controllers/playerStats.controller";
import teamsController from "../features/stats/controllers/teams.controller";
import seasonsController from "../features/stats/controllers/seasons.controller";
import achievementsController from "../features/stats/controllers/achievements.controller";

const statRoutes = express.Router();

// Game Routes
statRoutes.get("/api/games/recent/:amount", gamesController.getRecentGamesByAmount);
statRoutes.get("/api/games/division/:divisionId/:amount", gamesController.getRecentGamesByDivisionAndAmount);
statRoutes.get("/api/games/team/:teamId", gamesController.getAllGamesForTeam);

// Player Routes
statRoutes.get("/api/games/player/:summonerName/:tagline", gamesController.getAllGamesForPlayer);
statRoutes.get("/api/player/summoner/:summonerName/:tagline", playerStatsController.getOverallStatsForPlayer);
statRoutes.get("/api/player/puuid/:puuid", playerStatsController.getPlayerStatsByPuuid);
statRoutes.get("/api/player/:puuid/seasons", playerStatsController.getPlayerSeasons);
statRoutes.get("/api/player/check/:summonerName/:tagline", playerStatsController.checkPlayerExists);

// Team Routes
statRoutes.get("/api/team/:teamId", teamsController.getTeamStatsById);
statRoutes.get("/api/teams/:teamName/seasons", teamsController.getTeamSeasons);
statRoutes.get("/api/team/name/:teamName", teamsController.getTeamStatsByName);

statRoutes.get("/api/seasons", seasonsController.getAllSeasons);
statRoutes.get("/api/seasons/:seasonId", seasonsController.getSeasonById);
statRoutes.get("/api/achievements", achievementsController.getAchievements);

export default statRoutes;
