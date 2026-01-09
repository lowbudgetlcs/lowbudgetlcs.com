import { RecentGame } from "../../../types/StatTypes";

const getRecentGames = async (amount: number, divisionId?: number) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    let url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/games/recent/${amount}`;

    if (divisionId) {
      url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/games/division/${divisionId}/${amount}`;
    }

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch recent games");
    }

    const games: RecentGame[] = await response.json();
    return games;
  } catch (error) {
    console.error("Error fetching recent games:", error);
    return [];
  }
};

export default getRecentGames;
