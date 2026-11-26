import { TeamGame } from "../../../types/StatTypes";

const getTeamGames = async (teamId: number): Promise<TeamGame[]> => {
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

  return await response.json();
};

export default getTeamGames;
