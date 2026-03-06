import { NavLink } from "react-router-dom";
import StatsSearchUI from "./components/StatsSearchUI";
import MiniGameCard from "./components/cards/MiniGameCard";
import Title from "../../components/Title";
import Button from "../../components/Button";
import useRecentGamesQuery from "./api/queries/useRecentGamesQuery";
import LoadingIcon from "../../components/LoadingIcon";
const Stats = () => {
  const { data: recentGames, isLoading: loading, error } = useRecentGamesQuery(4);

  return (
    <div className="text-text-primary grow pt-16 transition duration-300 w-full px-4 md:px-16 max-w-7xl mb-4">
      <Title title="Stats" />
      <div className="flex flex-col items-center justify-center">
        <ul className="flex flex-col lg:flex-row items-center gap-4">
          {/* <NavLink
            to={"/#"}
            className={`text-xl font-bold w-48 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300 opacity-0 [animation-delay:400ms] animate-slide-in-right`}>
            <li>Seasons</li>
          </NavLink>
          <NavLink
            to={"/#"}
            className={`text-xl font-bold w-48 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300 opacity-0 [animation-delay:400ms] animate-fadeIn`}>
            <li>Divisions</li>
          </NavLink> */}
          <NavLink to={"/stats/team"}>
            <Button>Teams List</Button>
          </NavLink>
        </ul>
        <div className="playerSearch opacity-0 pt-4 [animation-delay:400ms] animate-fadeIn w-full max-w-3xl">
          <StatsSearchUI />
        </div>
      </div>
      <div className={`bg-bg rounded-xl border p-4 border-border flex flex-col w-full transition text-text-primary`}>
        <h2 className="text-2xl text-center font-bold opacity-0 pb-2 animate-slide-in-left">Recent Games</h2>
        {error && <p className="text-center text-red mt-4">Failed to load recent games. Please try again later.</p>}
        {loading && (
          <div className="flex justify-center py-8">
            <LoadingIcon />
          </div>
        )}
        <div className="flex flex-col md:grid grid-cols-2 gap-2 items-center min-h-64">
          {loading ? null : error ? null : recentGames?.map((game, index) => <MiniGameCard key={index} game={game} />)}
        </div>
      </div>
    </div>
  );
};

export default Stats;
