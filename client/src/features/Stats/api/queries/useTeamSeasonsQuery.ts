import { useQuery } from "@tanstack/react-query";
import getTeamSeasons from "../getTeamSeasons";

const useTeamSeasonsQuery = (teamName: string) => {
  return useQuery({
    queryKey: ["teamSeasons", teamName],
    queryFn: () => getTeamSeasons(teamName),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamSeasonsQuery;