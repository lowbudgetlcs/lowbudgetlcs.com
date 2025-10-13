import { Team } from "../../../types/RosterTypes";

const getTeamsBySeason = async (seasonId: number) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/stats/api/seasons/${seasonId}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch teams for season");
    }

    const teams: { divisions: any[]; teams: Team[] } = await response.json();
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for season ${seasonId}:`, error);
    return [];
  }
};

export default getTeamsBySeason;
