import express, { Request, Response } from "express";
const draftRoutes = express.Router();
import { insertDraft } from "../db/queries/insert";
import {
  checkDBForURL,
  getMatchingShortCode,
} from "../db/queries/select";



export interface DraftProps {
  lobbyCode: string;
  blueCode: string;
  redCode: string;
  blueName: string;
  redName: string;
  tournamentID: string | undefined;
}

draftRoutes.get(
  "/api/checkTournamentCode/:code",
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

// Draft Lobby Creation
const generateRandomString = () => Math.random().toString(36).substring(7);

draftRoutes.post(
  "/api/createLobby",
  async (req: Request, res: Response) => {
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
  }
);



export default draftRoutes;
