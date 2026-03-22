import express, { Request, Response } from "express";
const draftRoutes = express.Router();
import draftDataController from "../features/draft/controllers/draftData.controller";
import historyController from "../features/draft/controllers/history.controller";
import initializeController from "../features/draft/controllers/initialize.controller";

// Initialization routes
draftRoutes.get("/api/checkTournamentCode/:code", initializeController.checkTournamentCode);
draftRoutes.post("/api/createDraft", initializeController.createDraft);
draftRoutes.post("/api/createFearlessDraft", initializeController.createFearlessDraft);

// Past draft routes
draftRoutes.get("/api/pastDraft/:lobbyCode", historyController.getPastDraftByLobbyCode);
draftRoutes.get("/api/pastFearless/:fearlessCode", historyController.getPastFearlessByCode);

// Misc. draft data routes
draftRoutes.get("/api/updates", draftDataController.getUpdatesData);
draftRoutes.get("/api/championData", draftDataController.getChampionData);
export default draftRoutes;
