import { useQuery } from "@tanstack/react-query";
import getTeamByName from "../getTeamByName";

const useTeamByNameQuery = (teamName: string) => {
  return useQuery({
    queryKey: ["teamByName", teamName],
    queryFn: () => getTeamByName(teamName),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamByNameQuery;