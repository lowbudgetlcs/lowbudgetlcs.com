import { useQuery } from "@tanstack/react-query";
import getTeamGames from "../getTeamGames";

const useTeamGamesQuery = (teamId: number) => {
  return useQuery({
    queryKey: ["teamGames", teamId],
    queryFn: () => getTeamGames(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamGamesQuery;