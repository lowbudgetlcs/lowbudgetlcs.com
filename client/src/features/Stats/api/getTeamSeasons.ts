export interface TeamSeason {
  teamId: number;
  seasonId: number;
  seasonName: string;
  divisionName: string;
}

const getTeamSeasons = async (teamName: string): Promise<TeamSeason[]> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/teams/${encodeURIComponent(
      teamName
    )}/seasons`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team seasons");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getTeamSeasons;
