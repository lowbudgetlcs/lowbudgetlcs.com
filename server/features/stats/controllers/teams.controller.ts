import { Request, Response } from "express";
import { getDivisionsForSeason, getTeamIdByName, getTeamSeasonsByName } from "../../../db/queries/select";
import teamStatsAggregation from "../services/teamStatsAggregation.service";
import { getTeamLogoLookupKey, getTeamLogosFromSheets } from "../services/getTeamLogosFromSheets.service";

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
			const teamLogos = await getTeamLogosFromSheets();
			for (const div of divisions) {
				const logo = teamLogos.get(getTeamLogoLookupKey(div.name, teamName));
				if (logo) {
					teamLogo = logo;
					break;
				}
			}
		} catch (err) {
			console.warn("Error getting divisions or logos from Sheets:", err);
		}

		return res.json({ teamId, overallStats, logo: teamLogo });
	} catch (err) {
		next(err);
	}
};

const getTeamSeasons = async (req: Request, res: Response, next: Function) => {
	try {
		const teamName = decodeURIComponent(req.params.teamName);
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
