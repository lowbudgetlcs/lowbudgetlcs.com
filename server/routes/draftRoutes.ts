import express, { Request, Response } from "express";
const draftRoutes = express.Router();
import { insertDraft } from "../db/queries/insert";
import { getMatchingShortCode, getPastDraft } from "../db/queries/select";
import {
  DraftInitializeProps,
  initializeDraftState,
} from "../sockets/draftState";
import { FearlessInitializerProps } from "../draftTool/interfaces/initializerInferfaces";
import { fearlessLobbyInitializer } from "../draftTool/initializers/fearlessLobbyInitializer";
import { randomUUID } from "crypto";

draftRoutes.get(
  "/api/checkTournamentCode/:code",
  async (req: Request, res: Response) => {
    try {
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

draftRoutes.post("/api/createDraft", async (req: Request, res: Response) => {
  try {
    // Pull nick names and tournament ID from request (if there is one)
    const {
      redName,
      blueName,
      tournamentID,
    }: { redName: string; blueName: string; tournamentID: string | null } =
      req.body;

    // Generate unique URLs for the draft
    const lobbyCode = tournamentID ? tournamentID : randomUUID();
    const blueCode = randomUUID();
    const redCode = randomUUID();

    // Create the draft object
    const draft: DraftInitializeProps = {
      lobbyCode: lobbyCode,
      blueUser: blueCode,
      redUser: redCode,
      redDisplayName: redName,
      blueDisplayName: blueName,
      tournamentID: tournamentID,
    };

    // Initialize Draft
    initializeDraftState(draft);

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

draftRoutes.post(
  "/api/createFearlessDraft",
  async (req: Request, res: Response) => {
    try {
      // Pull nick names and tournament ID from request (if there is one)
      const {
        redName,
        blueName,
        draftCount,
      }: { redName: string; blueName: string; draftCount: number } = req.body;
      // Generate unique URLs for the draft
      const blueCode = randomUUID();
      const redCode = randomUUID();
      const fearlessCode = randomUUID();

      const fearlessLobby: FearlessInitializerProps = {
        fearlessCode: fearlessCode,
        blueCode: blueCode,
        redCode: redCode,
        blueDisplayName: blueName,
        redDisplayName: redName,
        draftCount: draftCount,
        draftLobbyCodes: [],
      };
      // Initialize Fearless Lobby
      const fearlessData = await fearlessLobbyInitializer(fearlessLobby);

      // Success Response
      res.status(201).json({
        fearlessLobby: {
          fearlessCode: fearlessData.fearlessCode,
          blueCode: fearlessData.blueCode,
          redCode: fearlessData.redCode,
          blueName: fearlessData.blueDisplayName,
          redName: fearlessData.redDisplayName,
          draftLobbyCodes: fearlessData.draftLobbyCodes,
        },
      });
    } catch (err) {
      console.error("Error in Draft Creation:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

draftRoutes.get(
  "/api/pastDraft/:lobbyCode",
  async (req: Request, res: Response) => {
    try {
      const lobbyCode = req.params.lobbyCode;
      const response = await getPastDraft(lobbyCode);

      if (response && response.draftFinished) {
        res
          .status(200)
          .json({ isValid: true, draftState: response.clientState });
      } else {
        res.status(200).json({ isValid: false });
      }
    } catch (err) {
      console.error("Error in Finding Past Game:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default draftRoutes;
