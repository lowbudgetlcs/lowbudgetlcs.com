import { useQuery } from "@tanstack/react-query";
import getPlayerGames from "../getPlayerGames";

const usePlayerGamesQuery = (
  summonerName: string,
  tagline: string,
  seasonId?: number
) => {
  return useQuery({
    queryKey: ["playerGames", summonerName, tagline, seasonId],
    queryFn: () => getPlayerGames(summonerName, tagline, seasonId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default usePlayerGamesQuery;