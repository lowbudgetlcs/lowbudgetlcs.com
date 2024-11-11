import React, { useState } from "react"
import Button from "../Button"
import { handlePlayerSearch } from "./StatsSearch"

function StatsMain() {

    const [summonerName, setSummonerName] = useState(" ")
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    return handlePlayerSearch(summonerName)
  }

 
  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl text-center">LBLCS Stats</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-8 w-full md:w-2/3 pt-8 md:text-center">
          Enter a player below to pull up their stats for season 13
        </p>
        <p className="text-white/60 text-lg px-8 p-8 text-center">Summoner names are <span className="underline">CASE SENSITIVE!</span> (this will be fixed in a later update)</p>
      </div>
      <div className="search">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 p-4 items-center">
            <input id="summonerName" name="summonerName" onChange={(e) => setSummonerName(e.target.value)} placeholder="JohnDoe#NA1" className="w-3/5 h-12 rounded-lg text-2xl p-4 text-black"></input>
            <button type="submit"><Button>Submit</Button></button> 
        </form>
      </div>
    </div>
  );
}

export default StatsMain;
