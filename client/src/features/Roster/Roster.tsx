import { NavLink } from "react-router-dom";
import { useLeagueData } from "../../components/leagueDataContext";
import ErrorPage from "../Error/ErrorPage";

function Roster() {
  const { divisions, error, loading } = useLeagueData();

  if (loading)
    return (
      <div className="relative accounts bg-white text-black dark:bg-black dark:text-white">
        <div className="title h-64 w-full flex items-center justify-center">
          <h1 className="text-6xl">All Rosters</h1>
        </div>

        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full"></div>
      </div>
    );
  if (error) return <ErrorPage />;

  return (
    <div className="accounts bg-white text-black dark:bg-black dark:text-white pb-12">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Rosters</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Check out all the teams in each division, look at the player's or custom team op.ggs!
        </p>
        <div className="cardContainer flex flex-col md:grid grid-cols-4 w-full px-4 gap-8">
          {divisions.map((division) => (
            <NavLink
              key={division}
              to={`/rosters/${division}`}
              className={`relative card cursor-pointer bg-orange flex items-center justify-center min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 dark:before:bg-light-gray before:z-0 before:absolute hover:before:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}>
              <h2 className="z-10 text-3xl text-white text-center font-semibold">{division}</h2>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Roster;
