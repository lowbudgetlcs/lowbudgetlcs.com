import { TeamOverallStats } from "../../../types/StatTypes";

const getTeamStatsById = async (teamId: number): Promise<TeamOverallStats> => {
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/team/${teamId}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team stats");
  }

  return await response.json();
};

export default getTeamStatsById;
