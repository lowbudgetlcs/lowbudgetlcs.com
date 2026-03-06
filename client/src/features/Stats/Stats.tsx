import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import getRecentGames from "./api/getRecentGames";
import { RecentGame } from "../../types/StatTypes";
import StatsSearchUI from "./components/StatsSearchUI";
import MiniGameCard from "./components/cards/MiniGameCard";
import Title from "../../components/Title";
import Button from "../../components/Button";
const Stats = () => {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRecentGames(4);
      if (response.length > 0) {
        setRecentGames(response);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="gap-2 bg-bg-dark text-text-primary grow pt-20 transition duration-300 w-full md:px-16 max-w-7xl">
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
        <div className="playerSearch opacity-0 pt-8 [animation-delay:400ms] animate-fadeIn w-full max-w-3xl">
          <StatsSearchUI />
        </div>
      </div>
      <div className={`bg-light-gray rounded-md md:w-md lg:w-lg border-2 p-4 border-gray flex flex-col transition text-white`}>
        <h2 className="text-2xl text-center font-bold opacity-0 pb-2 animate-slide-in-left">Recent Games</h2>
        <div className="flex flex-col gap-2 items-center min-h-64">
          {loading ? (
            <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
          ) : (
            recentGames.map((game, index) => <MiniGameCard key={index} game={game} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
