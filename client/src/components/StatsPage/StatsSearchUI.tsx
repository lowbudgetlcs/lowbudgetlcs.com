import React, { useState } from "react";
import Button from "../Button";
import { handlePlayerSearch } from "./StatsSearch";
import { useNavigate } from "react-router-dom";

function StatsSearchUI() {
    const [summonerName, setSummonerName] = useState("");
    const [gameList, setGameList] = useState<Array<object>>([]);
    console.debug(gameList)
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
        <div className="search flex-grow">
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
        </div>
    )
}

export default StatsSearchUI;