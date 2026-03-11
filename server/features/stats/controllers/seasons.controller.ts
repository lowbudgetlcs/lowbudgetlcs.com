import { Request, Response } from "express";
import { getSeasons, getTeamsBySeason } from "../../../db/queries/statQueries/select";
import { getDivisionsForSelectedSeason } from "../../../db/queries/select";
import { EventWithTeamsDto } from "../../../routes/rosterRoutes";

interface TeamResponse {
  divisions: {
    id: number;
    seasonId: number;
    divisionName: string;
    createdAt: string | null;
    eventId: number | null;
  };
  teams: {
    id: number;
    divisionId: number | null;
    teamName: string;
    teamTag: string | null;
    active: boolean;
    createdAt: string | null;
    formerTeam: number | null;
    logo?: string;
  } | null;
}

const seasonCache = new Map<number, any>();
const seasonCacheTTL = 10 * 60 * 60 * 1000;

const getAllSeasons = async (req: Request, res: Response, next: Function) => {
  try {
    const response = await getSeasons();
    if (response.length <= 0) {
      return res.status(404).json({ error: "Seasons Not Found" });
    }
    return res.json(response);
  } catch (err) {
    next(err);
  }
};

const getSeasonById = async (req: Request, res: Response, next: Function) => {
  if (seasonCache.has(Number(req.params.seasonId))) {
    return res.status(200).json(seasonCache.get(Number(req.params.seasonId)));
  }

  try {
    console.log(`Fetching season data for season ID ${req.params.seasonId} from DB.`);
    const seasonId: number = Number(req.params.seasonId);
    if (isNaN(seasonId) || seasonId <= 0) {
      return res.status(400).json({ error: "Invalid season ID" });
    }

    const teamsResponse: TeamResponse[] = await getTeamsBySeason(seasonId);
    if (teamsResponse.length <= 0) {
      return res.status(404).json({ error: "Season Not Found" });
    }

    for (const team of teamsResponse) {
      try {
        if (!team.teams) continue;
        const dennysApiResponse = await fetch(`https://dennys.lowbudgetlcs.com/api/v1/event/${team.divisions.eventId}/teams`);
        if (dennysApiResponse) {
          const dennysApiEventData: EventWithTeamsDto = await dennysApiResponse.json();
          const matchedTeam = dennysApiEventData.teams.find((matched) => matched.name.toLowerCase() === team.teams?.teamName.toLowerCase());
          if (matchedTeam) {
            team.teams.logo = matchedTeam.logoName;
          }
        }
      } catch (logoErr: any) {
        console.warn(`Error getting logos: `, logoErr.message);
      }
    }

    const divisionsResponse = await getDivisionsForSelectedSeason(seasonId);
    if (divisionsResponse.length <= 0) {
      return res.status(404).json({ error: "Season Not Found" });
    }

    seasonCache.set(seasonId, { teams: teamsResponse, divisions: divisionsResponse });
    setTimeout(() => {
      seasonCache.delete(seasonId);
    }, seasonCacheTTL);

    console.log(`Cached season data for season ID ${seasonId} for 10 hours.`);
    return res.json({ teams: teamsResponse, divisions: divisionsResponse });
  } catch (err) {
    next(err);
  }
};

const seasonsController = {
  getAllSeasons,
  getSeasonById,
};

export default seasonsController;