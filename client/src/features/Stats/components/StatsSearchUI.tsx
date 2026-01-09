import React, { useState } from "react";
import Button from "../../../components/Button";
import { handlePlayerSearch } from "./StatsSearch";
import { useNavigate } from "react-router-dom";

function StatsSearchUI({ navbar }: { navbar?: boolean }) {
  const [summonerName, setSummonerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await handlePlayerSearch(summonerName, setError, navigate);
    setLoading(false);
  };

  if (navbar) {
    return (
      <div className="search absolute right-48 hidden md:flex flex-col items-center">
        <form onSubmit={handleFormSubmit} className="flex relative items-center">
          <input
            id="summonerName"
            name="summonerName"
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="JohnDoe#NA1"
            className="h-6 rounded-lg px-2 py-4 text-black"
          />
          <button type="submit" className="scale-75">
            <Button>
              {loading ? (
                <div className="animate-spin border-b-2 border-l-2 border-t-2 border-orange rounded-full p-3"></div>
              ) : (
                "Search"
              )}
            </Button>
          </button>
          {error ? <p className="errorMessage absolute -bottom-5 text-orange">{error}</p> : <br />}
        </form>
      </div>
    );
  }
  return (
    <div className="search">
      <h2 className="text-center text-xl font-bold">Search a Player</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col p-2 items-center">
        <input
          id="summonerName"
          name="summonerName"
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="JohnDoe#NA1"
          className="h-12 rounded-lg text-2xl px-2 py-4 text-black"
        />
        {error ? <p className="error-message text-orange">{error}</p> : <br />}
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
  );
}

export default StatsSearchUI;
