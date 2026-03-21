import { useQuery } from "@tanstack/react-query";
import getTeamStatsById from "../getTeamStatsById";

const useTeamStatsByIdQuery = (teamId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["teamStatsById", teamId],
    queryFn: () => getTeamStatsById(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,

  });
};

export default useTeamStatsByIdQuery;