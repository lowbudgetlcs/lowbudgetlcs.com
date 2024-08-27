import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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
    <div className="accounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Teams</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click below to navigate leagues, groups, and teams
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8">
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              to={"economy"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-gold-light to-gold-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Economy
              </h2>
            </NavLink>
            <NavLink
              to={"commercial"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-platinum-light to-platinum-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Commercial
              </h2>
            </NavLink>
          </div>
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              to={"financial"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-emerald-light to-emerald-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Financial
              </h2>
            </NavLink>
            <NavLink
              to={"executive"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-challenger-blue to-challenger-gold transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Executive
              </h2>
            </NavLink>
          </div>
        </div>
        {/* <div className="teamContainer flex flex-col gap-8 md:w-3/5 lg:w-3/6 overflow-hidden justify-center">
        {teams.map((team) => {
          return <TeamCard key={team.id} teamName={team.teamName} groupId={team.groupId} divisionId={team.divisionId} logo={team.logo} playerList={team.playerList}/>
        }) }
      </div> */}
      </div>
    </div>
  );
}
export default Roster;
