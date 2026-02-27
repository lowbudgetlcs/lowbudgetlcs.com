import { useQuery } from "@tanstack/react-query";
import getRosterData from "./getRosterData";

const useRosterDataQuery = () => {
  return useQuery({
    queryKey: ["rosterData"],
    queryFn: getRosterData,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useRosterDataQuery;
