import { NextFunction, Request, Response } from "express";
import { getPastDraft, getPastFearlessSeries } from "../../../db/queries/select";

const getPastDraftByLobbyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lobbyCode = req.params.lobbyCode;
    const response = await getPastDraft(lobbyCode);

    if (response && response.draftFinished) {
      return res.status(200).json({ isValid: true, draftState: response.clientState });
    }

    return res.status(200).json({ isValid: false });
  } catch (err: unknown) {
    next(err);
  }
};

const getPastFearlessByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fearlessCode = req.params.fearlessCode;
    const response = await getPastFearlessSeries(fearlessCode);

    if (response) {
      return res.status(200).json(response);
    }

    return res.status(200).json({ isValid: false });
  } catch (err: unknown) {
    next(err);
  }
};

const historyController = {
  getPastDraftByLobbyCode,
  getPastFearlessByCode,
};

export default historyController;