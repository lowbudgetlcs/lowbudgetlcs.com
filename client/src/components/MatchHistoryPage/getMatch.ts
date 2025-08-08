import { MatchDto } from "./interfaces/MatchV5";

const getMatch = async (matchId: number) => {
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/mh/api/match/${matchId}`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return 404;
    } else if (response.status === 500) {
      return 500;
    }
    throw new Error("Failed to fetch data");
  }

  const matchData: MatchDto | number = await response.json();
  return matchData;
};

export default getMatch;
