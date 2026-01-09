import { RecentGame } from "../../../types/StatTypes";

const getTeamGames = async (teamId: number): Promise<RecentGame[] | null> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/games/team/${teamId}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team games");
    }

    const games: RecentGame[] = await response.json();
    return games;
  } catch (error) {
    console.error("Error fetching team games:", error);
    return null;
  }
};

export default getTeamGames;
