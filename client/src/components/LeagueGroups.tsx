import { Link, NavLink, useLocation } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useLeagueData } from "./leagueDataContext";

type LeagueGroupsProps = { league: string };

const commercialGradient =
  "bg-gradient-to-br from-platinum-light to-platinum-dark";
const financialGradient =
  "bg-gradient-to-br from-emerald-light to-emerald-dark";
const economyGradient = "bg-gradient-to-br from-gold-light to-gold-dark";
const executiveGradient =
  "bg-gradient-to-br from-challenger-blue to-challenger-gold";

function LeagueGroups() {
  const { league }: LeagueGroupsProps = useLocation().state;
  const { players, teams, divisions, error, loading } = useLeagueData();

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
    let gradient: string;
    switch (league) {
      case "Economy":
        gradient = economyGradient;
        break;
      case "Commercial":
        gradient = commercialGradient;
        break;
      case "Financial":
        gradient = financialGradient;
        break;
      case "Executive":
        gradient = executiveGradient;
        break;
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
          className={`relative card cursor-pointer ${gradient} flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
        >
          <h2 className="text-3xl text-white text-center font-semibold z-10">
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
      </div>
    </div>
  );
}

export default LeagueGroups;
