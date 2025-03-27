import { Link, useLocation } from "react-router-dom";
import TeamCard from "./TeamCard";
import { useState } from "react";
import ErrorPage from "../ErrorPage";
import { useLeagueData } from "../leagueDataContext";

type LeaguePlayersProps = { league: string; division: string };

function LeaguePlayers() {
  const { league }: LeaguePlayersProps = useLocation().state;
  const { players, teams, error, loading } = useLeagueData();
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  if (loading)
    return (
      <div className="relative accounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
        <div className="title h-64 w-full flex items-center justify-center">
          <h1 className="text-6xl">{league}</h1>
        </div>

        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full"></div>
      </div>
    );
  if (error) return <ErrorPage />;

  const handleCardToggle = (teamId: number) => {
    setOpenCardId(openCardId === teamId ? null : teamId);
  };

  let leagueId: number;
  switch (league) {
    case "Economy":
      leagueId = 7;
      break;
    case "Commercial":
      leagueId = 6;
      break;
    case "Financial":
      leagueId = 5;
      break;
    case "Executive":
      leagueId = 4;
      break;
    case "CEO":
      leagueId = 2;
      break;
  }
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
    <div className=" relative accounts bg-white text-black dark:bg-black dark:text-white min-h-screen pt-12">
      <Link
        state={{ league: league }}
        to={`/rosters`}
        className="fixed flex z-50 my-2 px-2 rounded-lg top-1 left-16 text-2xl font-semibold cursor-pointer w-fit h-fit justify-center items-center  group"
      >
        <div className="burger cursor-pointer relative h-12 w-6 gap-1 hover:cursor-pointer self-baseline">
          <div
            className={`absolute -rotate-45 top-5 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
          <div
            className={`absolute rotate-45 top-7 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
        </div>
        <p className="group-hover:text-orange underline underline-offset-2 transition duration-300 ">
          Rosters
        </p>
      </Link>
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl text-center">{league}</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click the dropdown to view team members
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8"></div>
        <div className="teamContainer grid grid-cols-1 lg:grid-cols-2 gap-8 md:w-3/5 lg:w-11/12 justify-center py-8 pb-[30rem]">
          {teams.map((team) => {
            if (team.divisionId === leagueId) {
              return (
                <TeamCard
                  key={team.id}
                  teamName={team.name}
                  groupId={team.groupId}
                  divisionId={team.divisionId}
                  logo={team.logo}
                  playerList={team.playerList}
                  isOpen={openCardId === team.id}
                  onToggle={() => handleCardToggle(team.id)}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default LeaguePlayers;
