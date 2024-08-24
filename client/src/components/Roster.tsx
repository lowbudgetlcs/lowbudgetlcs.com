import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

interface PlayerProps {
  id: number;
  primary_riot_id: string;
  team_id?: number;
  summoner_name: string;
}

function Roster() {
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    try {
      const { data: players, error } = await supabase.from("players").select();

      if (error) throw error;

      console.log(players);
      setPlayers(players as PlayerProps[]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="accounts bg-white text-black dark:bg-black dark:text-white">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Teams</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          The Low Budget LCS has four separate leagues defined by both max rank
          and a points system.
        </p>
      </div>
      <ul>
        {players.map((player: PlayerProps) => {
            const summonerName = player.summoner_name.split("#")
          return <li key={player.id}>Player: {summonerName[0]} { "#" + summonerName[1]}</li>;
        })}
      </ul>
    </div>
  );
}
export default Roster;
