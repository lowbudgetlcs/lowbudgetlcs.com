import { useQuery } from "@tanstack/react-query";
import getTeamsBySeason from "../getTeamsBySeason";

const useTeamsBySeasonQuery = (seasonId: number) => {
  return useQuery({
    queryKey: ["teamsBySeason", seasonId],
    queryFn: () => getTeamsBySeason(seasonId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamsBySeasonQuery;