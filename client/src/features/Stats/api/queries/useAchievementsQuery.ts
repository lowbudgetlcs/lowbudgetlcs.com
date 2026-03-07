import { useQuery } from "@tanstack/react-query";
import getAchievements from "../getAchievements";

const useAchievementsQuery = () => {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useAchievementsQuery;