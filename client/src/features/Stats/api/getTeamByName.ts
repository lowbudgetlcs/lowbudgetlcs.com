import { TeamByNameResponse } from "../../../types/StatTypes";
const getTeamByName = async (teamName: string): Promise<TeamByNameResponse> => {
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

  return await response.json();
};

export default getTeamByName;
