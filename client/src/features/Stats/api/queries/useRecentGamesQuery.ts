import { useQuery } from "@tanstack/react-query";
import getRecentGames from "../getRecentGames";

const useRecentGamesQuery = (amount: number, divisionId?: number) => {
  return useQuery({
    queryKey: ["recentGames", amount, divisionId],
    queryFn: () => getRecentGames(amount, divisionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useRecentGamesQuery;