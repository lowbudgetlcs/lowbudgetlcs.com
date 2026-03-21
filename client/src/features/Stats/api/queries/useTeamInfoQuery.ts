import { useQuery } from "@tanstack/react-query";
import getTeamInfo from "../getTeamInfo";

const useTeamInfoQuery = (teamId: number) => {
  return useQuery({
    queryKey: ["teamInfo", teamId],
    queryFn: () => getTeamInfo(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamInfoQuery;