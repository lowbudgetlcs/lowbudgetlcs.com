import { Request, Response } from "express";
import { getDivisionsForSeason, getTeamIdByName, getTeamSeasonsByName } from "../../../db/queries/select";
import { EventWithTeamsDto } from "../../../routes/rosterRoutes";
import teamStatsAggregation from "../../../stats/teamStatsAggregation";

const getTeamStatsById = async (req: Request, res: Response, next: Function) => {
	try {
		const teamId: number = Number(req.params.teamId);
		if (isNaN(teamId) || teamId <= 0) {
			return res.status(400).json({ error: "Invalid team ID" });
		}
		const overallStats = await teamStatsAggregation(teamId);
		if (!overallStats) {
			return res.status(404).json({ error: "Team Stats Not Found" });
		}
		return res.json(overallStats);
	} catch (err) {
		next(err);
	}
};

const getTeamStatsByName = async (req: Request, res: Response, next: Function) => {
	try {
		const teamName: string = decodeURIComponent(req.params.teamName);
		if (!teamName) {
			return res.status(400).json({ error: "Invalid team name" });
		}
		const teamId = await getTeamIdByName(teamName);
		if (!teamId) {
			return res.status(404).json({ error: "Team Not Found" });
		}
		const overallStats = await teamStatsAggregation(teamId);
		if (!overallStats) {
			return res.status(404).json({ error: "Team Stats Not Found" });
		}

		let teamLogo: string | null = null;
		try {
			const divisions = await getDivisionsForSeason();
			for (const div of divisions) {
				if (!div.eventId) continue;
				try {
					const dennysApiResponse = await fetch(`https://dennys.lowbudgetlcs.com/api/v1/event/${div.eventId}/teams`);
					if (!dennysApiResponse.ok) continue;
					const dennysApiEventData: EventWithTeamsDto = await dennysApiResponse.json();
					const matched = dennysApiEventData.teams.find((team) => team.name.toLowerCase() === teamName.toLowerCase());
					if (matched?.logoName) {
						teamLogo = matched.logoName;
						break;
					}
				} catch (logoErr: any) {
					console.warn("Error fetching logo from Dennys for division", div.eventId, logoErr.message);
				}
			}
		} catch (err) {
			console.warn("Error getting divisions or logos:", err);
		}

		return res.json({ teamId, overallStats, logo: teamLogo });
	} catch (err) {
		next(err);
	}
};

const getTeamSeasons = async (req: Request, res: Response, next: Function) => {
	try {
		const teamName = req.params.teamName;
		const seasons = await getTeamSeasonsByName(teamName);
		res.json(seasons);
	} catch (err) {
		next(err);
	}
};

const teamsController = {
	getTeamStatsById,
	getTeamStatsByName,
	getTeamSeasons,
};

export default teamsController;
