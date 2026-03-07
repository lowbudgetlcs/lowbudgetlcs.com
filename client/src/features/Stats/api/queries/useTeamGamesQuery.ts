import { useQuery } from "@tanstack/react-query";
import getTeamGames from "../getTeamGames";

const useTeamGamesQuery = (teamId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["teamGames", teamId],
    queryFn: () => getTeamGames(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default useTeamGamesQuery;