import { useState, useEffect } from "react";
type FetchError = Error & { message: string };

export interface PlayerProps {
  id: number;
  primaryRiotId: string;
  teamId?: number;
  summonerName: string;
}

export interface TeamProps {
  id: number;
  teamName: string;
  divisionId: number;
  groupId: string;
  captainId: number | null;
  logo: string | null;
  playerList: string[];
}

export interface DivisionProps {
  id: number;
  divisionName: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, teamsResponse, divisionsResponse] = await Promise.all([
          fetch(process.env.VITE_PLAYERS_URL as string),
          fetch(process.env.VITE_TEAMS_URL as string),
          fetch(process.env.VITE_DIVISIONS_URL as string),
        ]);

        if (!playersResponse.ok || !teamsResponse.ok || !divisionsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [playersData, teamsData, divisionsData] = await Promise.all([
          playersResponse.json() as Promise<PlayerProps[]>,
          teamsResponse.json() as Promise<TeamProps[]>,
          divisionsResponse.json() as Promise<DivisionProps[]>,
        ]);

        setPlayers(playersData);
        setTeams(teamsData);
        setDivisions(divisionsData);
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
