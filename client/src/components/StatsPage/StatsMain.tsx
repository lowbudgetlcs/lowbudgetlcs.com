import { NavLink } from "react-router-dom";
import MiniGameCard from "./cards/MiniGameCard";
import { useEffect, useState } from "react";
import getRecentGames from "./dataHandlers/getRecentGames";
import { RecentGame } from "../../types/StatTypes";
import StatsSearchUI from "./StatsSearchUI";
const StatsMain = () => {
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
    <div className="flex flex-col md:flex-row gap-2 bg-white text-black dark:bg-black dark:text-white grow pt-20 transition duration-500 items-center justify-around">
      <div className={` p-4 md:p-10 flex flex-col items-center transition duration-500 text-white`}>
        <h1 className="text-4xl text-center font-bold opacity-0 p-4 animate-slide-in-right">
          Stats
        </h1>
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
          <NavLink
            to={"/stats/team"}
            className={`text-xl font-bold w-48 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300 opacity-0 [animation-delay:400ms] animate-slide-in-left`}>
            <li>Teams List</li>
          </NavLink>
        </ul>
        <div className="playerSearch opacity-0 pt-8 [animation-delay:400ms] animate-fadeIn">
          <StatsSearchUI />
        </div>
      </div>
      <div
        className={`bg-light-gray rounded-md md:w-md lg:w-lg border-2 p-4 border-gray flex flex-col transition text-white`}>
        <h2 className="text-2xl text-center font-bold opacity-0 pb-2 animate-slide-in-left">
          Recent Games
        </h2>
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

export default StatsMain;
