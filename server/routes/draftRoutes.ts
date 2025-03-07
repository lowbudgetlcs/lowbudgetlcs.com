import express, { Request, Response } from "express";
const draftRoutes = express.Router();
import { insertDraft } from "../db/queries/insert";
import { checkDBForURL, getMatchingShortCode } from "../db/queries/select";
import {
  DraftInitializeProps,
  draftState,
  initializeDraftState,
} from "../sockets/draftState";

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

// Draft Lobby Creation
const generateRandomString = () => Math.random().toString(36).substring(7);

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
    let blueCode, redCode, lobbyCode;

    // Sets lobbyCode to the tournament ID if Tournament Draft is used
    // Otherwise uses only the draft state to store information
    if (tournamentID) {
      lobbyCode = tournamentID;
      // Checks for all URLs to be unique
      while (true) {
        blueCode = generateRandomString();
        redCode = generateRandomString();
        const urlResponse = await checkDBForURL(blueCode, redCode);
        if (
          urlResponse.length === 0 &&
          redCode !== blueCode &&
          lobbyCode !== redCode &&
          lobbyCode !== blueCode
        ) {
          break;
        }
        console.log("URLs not unique, retrying...");
      }
    } else {
      // Checks for all URLs to be unique
      while (true) {
        blueCode = generateRandomString();
        redCode = generateRandomString();
        lobbyCode = generateRandomString();
        if (
          !draftState[lobbyCode] &&
          redCode !== blueCode &&
          lobbyCode !== redCode &&
          lobbyCode !== blueCode
        ) {
          break;
        }
        console.log("URLs not unique, retrying...");
      }
    }

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

    // Save Draft to Database if tournament code is present, otherwise it will just have the record
    if (tournamentID) {
      await insertDraft(draft);
    }

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

export default draftRoutes;
