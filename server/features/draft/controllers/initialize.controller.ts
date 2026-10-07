import { NextFunction, Request, Response } from "express";
import ShortUniqueId from "short-unique-id";
import { insertDraft } from "../../../db/queries/insert";
import { checkDuplicateShortCode } from "../../../db/queries/select";
import { fearlessLobbyInitializer } from "../initializers/fearlessLobbyInitializer";
import { DraftInitializeProps, initializeDraftState } from "../models/draftState";
import { FearlessInitializerProps } from "../types/initializerInferfaces";
import { waitForRiotRateLimit } from "../../../utils/riotRateLimiter";
import { RiotAPI } from "@fightmegg/riot-api";

const { randomUUID } = new ShortUniqueId({ length: 10 });

const checkTournamentCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shortCode = req.params.code;
    if (!process.env.RIOTAPI) {
      throw new Error("No API KEY");
    }

    const checkDBForTourneyCode = await checkDuplicateShortCode(shortCode);
    if (checkDBForTourneyCode) {
      res.status(200).json({ valid: false });
      return;
    }
    const rAPI = new RiotAPI(process.env.RIOTAPI);
    await waitForRiotRateLimit();
    const response = await rAPI.tournamentV5.getByTournamentCode({ tournamentCode: shortCode });
    if (response) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (err: unknown) {
    next(err);
  }
};

const createDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { redName, blueName, tournamentID }: { redName: string; blueName: string; tournamentID?: string } = req.body;

    const lobbyCode = tournamentID || randomUUID();
    const blueCode = randomUUID();
    const redCode = randomUUID();

    const draft: DraftInitializeProps = {
      lobbyCode,
      blueUser: blueCode,
      redUser: redCode,
      tournamentID: tournamentID || null,
      redDisplayName: redName,
      blueDisplayName: blueName,
    };

    initializeDraftState(draft);
    await insertDraft(draft);

    res.status(201).json({
      draft: {
        lobbyCode,
        blueCode,
        redCode,
      },
    });
  } catch (err: unknown) {
    next(err);
  }
};

const createFearlessDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      team1Name,
      team2Name,
      draftCount,
      tournamentID,
    }: { team1Name: string; team2Name: string; draftCount: number; tournamentID?: string | null } = req.body;

    const team1Code = randomUUID();
    const team2Code = randomUUID();
    const fearlessCode = randomUUID();

    const fearlessLobby: FearlessInitializerProps = {
      fearlessCode,
      team1Code,
      team2Code,
      team1Name,
      team2Name,
      draftCount,
      initialTournamentCode: tournamentID || undefined,
    };

    const fearlessData = await fearlessLobbyInitializer(fearlessLobby);

    res.status(201).json({
      fearlessCode: fearlessData.fearlessCode,
      team1Code: fearlessData.team1Code,
      team2Code: fearlessData.team2Code,
      team1Name: fearlessData.team1Name,
      team2Name: fearlessData.team2Name,
      draftCount: fearlessData.draftCount,
    });
  } catch (err: unknown) {
    next(err);
  }
};

const initializeController = {
  checkTournamentCode,
  createDraft,
  createFearlessDraft,
};

export default initializeController;
