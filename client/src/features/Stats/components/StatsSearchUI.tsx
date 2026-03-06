import React, { useState } from "react";
import Button from "../../../components/Button";
import { handlePlayerSearch } from "./StatsSearch";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../../components/LoadingIcon";
import AltButton from "../../../components/AltButton";

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
      <div className="search hidden md:flex items-center bg-bg-primary">
        <form onSubmit={handleFormSubmit} className="flex relative items-center">
          <input
            id="summonerName"
            name="summonerName"
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="JohnDoe#NA1"
            className="h-6 rounded-lg px-2 py-4 text-text-primary bg-bg placeholder:text-text-secondary focus:outline-none ring-border ring focus:ring focus:ring-orange focus:ring-offset-2 focus:ring-offset-bg"
          />
          <AltButton className="scale-75">{loading ? <LoadingIcon /> : "Search"}</AltButton>
        </form>
        {error ? <p className="errorMessage absolute -bottom-10 text-orange text-sm">{error}</p> : <br />}
      </div>
    );
  }
  return (
    <div className="search">
      <h2 className="text-center text-xl font-bold">Search a Player</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row p-2 items-center w-full gap-2">
        <div className="flex flex-col gap-2 grow">
          <input
            id="summonerName"
            name="summonerName"
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="JohnDoe#NA1"
            className="h-10 w-full rounded-md text-2xl px-2 py-4 text-text-primary bg-bg placeholder:text-text-secondary focus:outline-none ring-border ring focus:ring focus:ring-orange focus:ring-offset-2 focus:ring-offset-bg"
          />
        </div>
        <Button type="submit" className="w-24">
          {loading ? <LoadingIcon /> : "Submit"}
        </Button>
      </form>
      {error ? <p className="error-message text-orange text-center">{error}</p> : <br />}
    </div>
  );
}

export default StatsSearchUI;
