import { useQuery } from "@tanstack/react-query";
import getSeasons from "../getSeasons";

const useSeasonsQuery = () => {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useSeasonsQuery;