import { Link, useLocation } from "react-router-dom";
import TeamCard from "./TeamCard";
import { PlayerProps, TeamProps } from "./Roster";
interface LeaguePlayersProps {
  league: string;
  teams: TeamProps[];
  players: PlayerProps[];
  group: string;
}

function LeaguePlayers() {
  const { league, teams, players, group }: LeaguePlayersProps =
    useLocation().state;

  let leagueId: number;

  switch (league) {
    case "Economy":
      leagueId = 1;
      break;
    case "Commercial":
      leagueId = 2;
      break;
    case "Financial":
      leagueId = 3;
      break;
    case "Executive":
      leagueId = 4;
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
    <div className=" relativeaccounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Link
        state={{ league: league, teams: teams, players: players }}
        to={`/rosters/${league.toLowerCase()}`}
        className="absolute top-16 left-4 text-2xl font-semibold cursor-pointer underline underline-offset-2 transition duration-300 hover:text-orange"
      >
        Back to Groups
      </Link>
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">
          {league}: Group {group}
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click the dropdown to view team members
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8"></div>
        <div className="teamContainer flex flex-col gap-8 md:w-3/5 lg:w-3/6 overflow-hidden justify-center py-8">
          {teams.map((team) => {
            if (team.groupId === group && team.divisionId === leagueId) {
              return (
                <TeamCard
                  key={team.id}
                  teamName={team.teamName}
                  groupId={team.groupId}
                  divisionId={team.divisionId}
                  logo={team.logo}
                  playerList={team.playerList}
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
