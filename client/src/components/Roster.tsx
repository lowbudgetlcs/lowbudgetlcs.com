import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import ErrorPage from "./ErrorPage";

// const playesrUrl = "https://backend.lowbudgetlcs.com/api/getPlayers"
// const teamsUrl = "https://backend.lowbudgetlcs.com/api/getTeams"
const playersUrl = "http://localhost:8080/api/getPlayers";
const teamsUrl = "http://localhost:8080/api/getTeams";
const divisionsUrl = "http://localhost:8080/api/getDivisions";
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

function Roster() {
  const [error, setError] = useState(false);
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [divisions, setDivisions] = useState<DivisionProps[]>([]);
  useEffect(() => {
    const fetchAllData = async () => {
       try {
          const [playersResponse, teamsResponse, divisionsResponse] = await Promise.all([
             fetch(playersUrl),
             fetch(teamsUrl),
             fetch(divisionsUrl),
          ]);
 
          if (!playersResponse.ok || !teamsResponse.ok || !divisionsResponse.ok) {
             throw new Error('Error fetching data');
          }
 
          const [playersData, teamsData, divisionsData] = await Promise.all([
             playersResponse.json(),
             teamsResponse.json(),
             divisionsResponse.json(),
          ]);
 
          setPlayers(playersData);
          setTeams(teamsData);
          setDivisions(divisionsData);
       } catch (err) {
          console.error(err);
          setError(true);
       }
    };
 
    fetchAllData();
 }, []);

  if (error) {
    return <ErrorPage />;
 }
  return (
    <div className="accounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Rosters</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click below to navigate leagues, groups, and teams
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8">
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              state={{ league: "Economy", teams: teams, players: players, divisions: divisions }}
              to={"economy"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-gold-light to-gold-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Economy
              </h2>
            </NavLink>
            <NavLink
              state={{ league: "Commercial", teams: teams, players: players, divisions: divisions }}
              to={"commercial"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-platinum-light to-platinum-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Commercial
              </h2>
            </NavLink>
          </div>
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              state={{ league: "Financial", teams: teams, players: players, divisions: divisions }}
              to={"financial"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-emerald-light to-emerald-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Financial
              </h2>
            </NavLink>
            <NavLink
              state={{ league: "Executive", teams: teams, players: players, divisions: divisions }}
              to={"executive"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-challenger-blue to-challenger-gold transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Executive
              </h2>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Roster;
