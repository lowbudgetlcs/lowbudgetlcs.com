import { PlayerOverallStats } from "../../../types/StatTypes";

const getPlayerOverallStats = async (
  summonerName: string,
  tagline: string
) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/player/summoner/${summonerName}/${tagline}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch player overall stats");
    }

    const stats: PlayerOverallStats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching player overall stats:", error);
    return null;
  }
};

export default getPlayerOverallStats;
