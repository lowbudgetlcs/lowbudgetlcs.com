import { Link, NavLink, useLocation } from "react-router-dom";
import { DivisionProps, PlayerProps, TeamProps } from "./Roster";
import ErrorPage from "./ErrorPage";
import { useFetchData } from "../leagueData";
interface LeagueGroupsProps {
  league: string;
  teams: TeamProps[];
  players: PlayerProps[];
  divisions: DivisionProps[];
  error: boolean;
}

function LeagueGroups() {
  const { league }: LeagueGroupsProps = useLocation().state;
  const { players, teams, divisions, error, loading } = useFetchData();

  if (loading)
    return (
      <div className="relative accounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
        <div className="title h-64 w-full flex items-center justify-center">
          <h1 className="text-6xl">{league}</h1>
        </div>

        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full"></div>
      </div>
    );
  if (error) return <ErrorPage />;

  const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const displayGroups = () => {
    if (!divisions || divisions.length === 0) {
      return (
        <div className="">
          No Divisions for this League? Must be an error. Try reloading!
        </div>
      );
    }

    const currentDivision = divisions.find(
      (division) => division.divisionName === league
    );
    if (!currentDivision) {
      return <div>No Groups for this league</div>;
    }

    return Array.from({ length: currentDivision.groups }, (_, i) => {
      const groupLetter = groupLetters[i];
      return (
        <NavLink
          key={groupLetter}
          state={{
            league: league,
            teams: teams,
            players: players,
            group: groupLetter,
            divisions: divisions,
          }}
          to={groupLetter.toLowerCase()}
          className={`card cursor-pointer hover:bg-gradient-to-br from-gold-light to-gold-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
        >
          <h2 className="text-3xl text-white text-center font-semibold">
            Group {groupLetter}
          </h2>
        </NavLink>
      );
    });
  };

  return (
    <div className=" relativeaccounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Link
        to={"/rosters"}
        className="absolute top-16 left-4 text-2xl font-semibold cursor-pointer underline underline-offset-2 transition duration-300 hover:text-orange"
      >
        Back to Rosters
      </Link>
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">{league}</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click below to navigate groups, and teams
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8">
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            {displayGroups()}
          </div>
        </div>
        {/* <div className="teamContainer flex flex-col gap-8 md:w-3/5 lg:w-3/6 overflow-hidden justify-center">
          {teams.map((team) => {
            return <TeamCard key={team.id} teamName={team.teamName} groupId={team.groupId} divisionId={team.divisionId} logo={team.logo} playerList={team.playerList}/>
          }) }
        </div> */}
      </div>
    </div>
  );
}

export default LeagueGroups;
