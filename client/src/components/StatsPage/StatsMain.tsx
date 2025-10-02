import { NavLink } from "react-router-dom";
import MiniGameCard from "./cards/MiniGameCard";
import { useEffect, useState } from "react";
import getRecentGames from "./dataHandlers/getRecentGames";
import { RecentGame } from "../../types/StatTypes";
const StatsMain = () => {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRecentGames(5);
      if (response.length > 0) {
        setRecentGames(response);
        setLoading(false);
      }
    };

    fetchData();
  }, [])
  return (
    <div className="flex gap-2 bg-white text-black dark:bg-black dark:text-white grow pt-20 transition duration-500 items-center justify-around">
      <div
        className={`bg-light-gray rounded-md border-2 p-4 md:p-12 border-gray bg-opacity-95 flex flex-col items-center transition duration-500 text-white`}>
        <h1 className="text-4xl text-center font-bold opacity-0 p-4 [animation-delay:100ms] animate-slide-in-right">
          Stats
        </h1>
        <ul className="flex flex-col items-center opacity-0 gap-4 [animation-delay:300ms] animate-slide-in-right">
          <NavLink
            to={"/#"}
            className={`text-xl font-bold w-52 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300`}>
            <li>Divisions</li>
          </NavLink>
          <NavLink
            to={"/#"}
            className={`text-xl font-bold w-52 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300`}>
            <li>Teams</li>
          </NavLink>
          <NavLink
            to={"/#"}
            className={`text-xl font-bold w-52 text-center bg-gray px-8 py-8 rounded-md hover:bg-orange transition duration-300`}>
            <li>Player Search</li>
          </NavLink>
        </ul>
      </div>
      <div
        className={`bg-light-gray rounded-md border-2 p-4 md:p-12 border-gray flex flex-col items-center transition text-white`}>
        <h2 className="text-3xl text-center font-bold opacity-0 p-4 [animation-delay:100ms] animate-slide-in-right">
          Recent Games
        </h2>
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
          ) : (
            recentGames.map((game, index) => (
              <MiniGameCard key={index} game={game} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsMain;
