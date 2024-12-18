import { useState } from "react";
import Button from "../Button";
import { useLeagueData } from "../leagueDataContext";
import StatsTeamCard from "./StatsTeamCard";
import { Link } from "react-router-dom";

function StatsSeason() {
  const [season, setSeason] = useState<number>();
  const { players, teams } = useLeagueData();

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
    <>
      {season ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {teams.map((team) => {
            return (
              <Link
                to={`team/` + team.id.toString()}
                key={team.id}
                state={{
                  teamName: team.name,
                  groupId: team.groupId,
                  divisionId: team.divisionId,
                  logo: team.logo,
                  playerList: team.playerList,
                }}
              >
                <StatsTeamCard
                  key={team.id}
                  teamName={team.name}
                  groupId={team.groupId}
                  divisionId={team.divisionId}
                  logo={team.logo}
                  playerList={team.playerList}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="seasonList flex flex-col justify-center items-center py-4 text-center">
          <h2 className="text-center text-2xl font-bold p-4">
            Choose a Season
          </h2>
          <div
            onClick={() => {
              setSeason(13);
            }}
            className="cursor-pointer"
          >
            <Button>
              Season 13
              <br />
              <span>Summer/Fall 2024</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default StatsSeason;
