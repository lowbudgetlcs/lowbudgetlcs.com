import { useState, useEffect } from "react";
type FetchError = Error & { message: string };

export interface RosterProps {
  divisionData: DivisionProps[];
  teamData: TeamProps[];
  playerData: PlayerProps[];
}
export interface PlayerProps {
  id: number;
  primaryRiotId: string;
  teamId?: number;
  summonerName: string;
}

export interface TeamProps {
  id: number;
  name: string;
  divisionId: number;
  groupId: string;
  captainId: number | null;
  logo: string | null;
  playerList: string[];
}

export interface DivisionProps {
  id: number;
  name: string;
  description: string | null;
  providerId: number;
  tournamentId: number;
  groups: number;
}

export const useFetchData = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [divisions, setDivisions] = useState<DivisionProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://backend.lowbudgetlcs.com/roster/api/rosterdata",
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

        setPlayers(rosterData.playerData);
        setTeams(rosterData.teamData);
        setDivisions(rosterData.divisionData);
      } catch (err) {
        const error = err as FetchError;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { players, teams, divisions, error, loading };
};
