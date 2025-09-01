import { useState, useEffect } from "react";
type FetchError = Error & { message: string };

export interface RosterProps {
  divisions: string[];
  teams: TeamProps[];

}

export interface TeamProps {
  name: string;
  logo?: string;
  players: PlayerProps[];
  division: string;
}
export interface PlayerProps {
  points: string;
  name: string;
}

export const useFetchData = () => {
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/roster/api/rosterdata`,
          {
            headers: {
              "x-api-key": apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const rosterData: RosterProps = await response.json();

        setTeams(rosterData.teams);
        setDivisions(rosterData.divisions);
      } catch (err) {
        const error = err as FetchError;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { teams, divisions, error, loading };
};
