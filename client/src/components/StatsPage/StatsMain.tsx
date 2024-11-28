import React, { useState } from "react";
import Button from "../Button";
import { handlePlayerSearch } from "./StatsSearch";
import { useNavigate } from "react-router-dom";

function StatsMain() {
  const [summonerName, setSummonerName] = useState("");
  const [gameList, setGameList] = useState<Array<object>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await handlePlayerSearch(summonerName, setGameList, setError, navigate);
    setLoading(false);
  };

  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl text-center">LBLCS Stats</h1>
      </div>
      <div className="statsMainContainer flex flex-col md:flex-row justify-center p-8 gap-8">
        <div
          className={`relative card cursor-pointer bg-gradient-to-br from-orange to-black flex items-center justify-center w-full min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
        >
          <h2 className="text-3xl text-white text-center font-semibold z-10">
            Search Player
          </h2>
        </div>
        <div
          className={`relative card cursor-pointer bg-gradient-to-br from-orange to-black flex items-center justify-center w-full min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
        >
          <h2 className="text-3xl text-white text-center font-semibold z-10">
            Team Stats
          </h2>
        </div>
        {/* <div className="search flex-grow">
          <h2 className="text-center text-xl font-bold">Search a Player</h2>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 p-4 items-center"
          >
            <input
              id="summonerName"
              name="summonerName"
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="JohnDoe#NA1"
              className="w-3/5 h-12 rounded-lg text-2xl p-4 text-black"
            />
            {error ? (
              <p className="error-message text-orange">{error}</p>
            ) : (
              <br />
            )}
            <button type="submit">
              <Button>
                {loading ? (
                  <div className="animate-spin border-b-2 border-l-2 border-t-2 border-orange rounded-full p-3"></div>
                ) : (
                  "Submit"
                )}
              </Button>
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
}

export default StatsMain;

// <div className="statsSeasonList flex flex-col flex-grow">
// <h2 className="text-center text-xl font-bold">Choose a Season</h2>
// <Button>2023</Button>
// </div>
