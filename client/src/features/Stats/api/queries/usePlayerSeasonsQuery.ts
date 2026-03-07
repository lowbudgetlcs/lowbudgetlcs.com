import { useQuery } from "@tanstack/react-query";
import getPlayerSeasons from "../getPlayerSeasons";

const usePlayerSeasonsQuery = (puuid: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["playerSeasons", puuid],
    queryFn: () => getPlayerSeasons(puuid),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

export default usePlayerSeasonsQuery;