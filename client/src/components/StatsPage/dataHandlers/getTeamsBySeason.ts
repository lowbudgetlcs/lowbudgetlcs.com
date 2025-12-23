import { TeamBySeason } from "../../../types/RosterTypes";

const getTeamsBySeason = async (seasonId: number) => {
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/seasons/${seasonId}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch teams for season");
  }
  const teams: TeamBySeason = await response.json();
  return teams;
};

export default getTeamsBySeason;
