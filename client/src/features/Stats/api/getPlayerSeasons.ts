export interface PlayerSeason {
  teamId: number;
  seasonId: number;
  seasonName: string;
  divisionName: string;
  teamName: string;
}

const getPlayerSeasons = async (puuid: string): Promise<PlayerSeason[]> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/player/${puuid}/seasons`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch player seasons");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getPlayerSeasons;
