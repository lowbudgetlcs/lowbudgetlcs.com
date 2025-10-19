import { RecentGame } from "../../../types/StatTypes";

const getPlayerGames = async (summonerName: string, tagline: string) => {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/stats/api/games/player/${summonerName}/${tagline}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch player games");
    }

    const games: RecentGame[] = await response.json();
    return games;
};

export default getPlayerGames;
