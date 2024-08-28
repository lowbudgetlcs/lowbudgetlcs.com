import { NavLink } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useLeagueData } from "./leagueDataContext";
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
  const { players, teams, divisions, error, loading } = useLeagueData();

  if (loading)
    return (
      <div className="relative accounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
        <div className="title h-64 w-full flex items-center justify-center">
          <h1 className="text-6xl">All Rosters</h1>
        </div>

        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full"></div>
      </div>
    );
  if (error) return <ErrorPage />;

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
              state={{
                league: "Economy",
                teams: teams,
                players: players,
                divisions: divisions,
                error: error,
                loading: loading,
              }}
              to={"/rosters/economy"}
              className={`relative card cursor-pointer  bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
            >
              <h2 className="z-10 text-3xl text-white text-center font-semibold">
                Economy
              </h2>
            </NavLink>
            <NavLink
              state={{
                league: "Commercial",
                teams: teams,
                players: players,
                divisions: divisions,
                error: error,
                loading: loading,
              }}
              to={"/rosters/commercial"}
              className={`relative card cursor-pointer bg-gradient-to-br from-platinum-light to-platinum-dark flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
            >
              <h2 className="text-3xl text-white text-center font-semibold z-10">
                Commercial
              </h2>
            </NavLink>
          </div>
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              state={{
                league: "Financial",
                teams: teams,
                players: players,
                divisions: divisions,
                error: error,
                loading: loading,
              }}
              to={"/rosters/financial"}
              className={`relative card cursor-pointer bg-gradient-to-br from-emerald-light to-emerald-dark flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
            >
              <h2 className="text-3xl text-white text-center font-semibold z-10">
                Financial
              </h2>
            </NavLink>
            <NavLink
              state={{
                league: "Executive",
                teams: teams,
                players: players,
                divisions: divisions,
                error: error,
                loading: loading,
              }}
              to={"/rosters/executive"}
              className={`relative card cursor-pointer bg-gradient-to-br from-challenger-blue to-challenger-gold flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
            >
              <h2 className="text-3xl text-white text-center font-semibold z-10">
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
