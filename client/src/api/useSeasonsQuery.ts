import { useQuery } from "@tanstack/react-query";
import getSeasons from "./getSeasons";

const useSeasonsQuery = () => {
  return useQuery({
    queryKey: ["seasonsData"],
    queryFn: getSeasons,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useSeasonsQuery;
