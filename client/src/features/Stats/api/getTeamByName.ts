import { TeamOverallStats } from "../../../types/StatTypes";

interface TeamByNameResponse {
  teamId: number;
  overallStats: TeamOverallStats;
  logo?: string | null;
}

const getTeamByName = async (teamName: string): Promise<TeamByNameResponse | null> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/team/name/${encodeURIComponent(
      teamName
    )}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team info by name");
    }

    const payload: TeamByNameResponse = await response.json();
    return payload;
  } catch (error) {
    console.error("Error fetching team by name:", error);
    return null;
  }
};

export default getTeamByName;
