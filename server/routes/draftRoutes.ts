import express, { Request, Response } from "express";
const draftRoutes = express.Router();
import { insertDraft } from "../db/queries/insert";
import { getMatchingShortCode, getPastDraft, getPastFearlessSeries } from "../db/queries/select";
import { DraftInitializeProps, initializeDraftState } from "../draftTool/states/draftState";
import { FearlessInitializerProps } from "../draftTool/interfaces/initializerInferfaces";
import { fearlessLobbyInitializer } from "../draftTool/initializers/fearlessLobbyInitializer";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 10 });

draftRoutes.get("/api/checkTournamentCode/:code", async (req: Request, res: Response) => {
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
});

draftRoutes.post("/api/createDraft", async (req: Request, res: Response) => {
  try {
    // Pull nick names and tournament ID from request (if there is one)
    const {
      redName,
      blueName,
      tournamentID,
    }: { redName: string; blueName: string; tournamentID?: string} = req.body;

    // Generate unique URLs for the draft
    const lobbyCode = tournamentID ? tournamentID : randomUUID();
    const blueCode = randomUUID();
    const redCode = randomUUID();

    // Create the draft object
    const draft: DraftInitializeProps = {
      lobbyCode: lobbyCode,
      blueUser: blueCode,
      redUser: redCode,
      tournamentID: tournamentID || null,
      redDisplayName: redName,
      blueDisplayName: blueName,
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

draftRoutes.post("/api/createFearlessDraft", async (req: Request, res: Response) => {
  try {
    // Pull nick names and tournament ID from request (if there is one)
    const {
      team1Name,
      team2Name,
      draftCount,
      tournamentID,
    }: { team1Name: string; team2Name: string; draftCount: number; tournamentID?: string | null } =
      req.body;
    // Generate unique URLs for the draft
    const team1Code = randomUUID();
    const team2Code = randomUUID();
    const fearlessCode = randomUUID();

    const fearlessLobby: FearlessInitializerProps = {
      fearlessCode: fearlessCode,
      team1Code: team1Code,
      team2Code: team2Code,
      team1Name: team1Name,
      team2Name: team2Name,
      draftCount: draftCount,
      initialTournamentCode: tournamentID || undefined,
    };

    // Initialize Fearless Lobby
    const fearlessData = await fearlessLobbyInitializer(fearlessLobby);

    // Success Response
    res.status(201).json({
      fearlessCode: fearlessData.fearlessCode,
      team1Code: fearlessData.team1Code,
      team2Code: fearlessData.team2Code,
      team1Name: fearlessData.team1Name,
      team2Name: fearlessData.team2Name,
      draftCount: fearlessData.draftCount,
    });
  } catch (err) {
    console.error("Error in Draft Creation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

draftRoutes.get("/api/pastDraft/:lobbyCode", async (req: Request, res: Response) => {
  try {
    const lobbyCode = req.params.lobbyCode;
    const response = await getPastDraft(lobbyCode);

    if (response && response.draftFinished) {
      res.status(200).json({ isValid: true, draftState: response.clientState });
    } else {
      res.status(200).json({ isValid: false });
    }
  } catch (err) {
    console.error("Error in Finding Past Game:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

draftRoutes.get("/api/pastFearless/:fearlessCode", async (req: Request, res: Response) => {
  try {
    const fearlessCode = req.params.fearlessCode;
    const response = await getPastFearlessSeries(fearlessCode);

    if (response) {
      res.status(200).json(response);
    } else {
      res.status(200).json({ isValid: false });
    }
  } catch (err) {
    console.error("Error in Finding Past Game:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default draftRoutes;
