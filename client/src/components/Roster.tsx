import { useEffect, useState } from "react";
import TeamCard from "./TeamCard";

// const url = "https://backend.lowbudgetlcs.com/api/getPlayers"
const playesrUrl = "http://localhost:8080/api/getPlayers";
const teamsUrl = "http://localhost:8080/api/getTeams";
interface PlayerProps {
  id: number;
  primaryRiotId: string;
  teamId?: number;
  summonerName: string;
}

interface TeamProps {
  id: number;
  teamName: string;
  divisionId: number;
  groupId: string;
  captainId: number | null;
  logo: string | null;
  playerList: string[];
}

function Roster() {
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [teams, setTeams] = useState<TeamProps[]>([]);

  useEffect(() => {
    const getAllPlayers = async () => {
      try {
        console.log("getting players...");
        const response = await fetch(playesrUrl, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlayers(data as PlayerProps[]);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    getAllPlayers();
    const getAllTeams = async () => {
      try {
        console.log("getting teams...");
        const response = await fetch(teamsUrl, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data as TeamProps[]);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    getAllPlayers();
    getAllTeams();
  }, []);

  //Adds player names to each team under the playerList key
  teams.forEach((team) => {
    const playerList: string[] = [];
    players.forEach((player) => {
      if (player.teamId === team.id) {
        playerList.push(player.summonerName);
      }
    });
    team.playerList = playerList;
  });


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
      <div className="teamContainer">
        {teams.map((team) => {
          return <TeamCard key={team.id} teamName={team.teamName} groupId={team.groupId} logo={team.logo} playerList={team.playerList}/>
        })}
      </div>
    </div>
  );
}
export default Roster;
