import { useQuery } from "@tanstack/react-query";
import getPlayerOverallStats from "../getPlayerOverallStats";

const usePlayerOverallStatsQuery = (
  summonerName: string,
  tagline: string,
  seasonId?: number
) => {
  return useQuery({
    queryKey: ["playerOverallStats", summonerName, tagline, seasonId],
    queryFn: () => getPlayerOverallStats(summonerName, tagline, seasonId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default usePlayerOverallStatsQuery;