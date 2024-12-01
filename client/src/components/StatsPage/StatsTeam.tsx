import { useState } from "react";
import Button from "../Button";
import { useLeagueData } from "../leagueDataContext";
import StatsTeamCard from "./StatsTeamCard";

function StatsTeam() {
  const [season, setSeason] = useState<number>();
  const [areTeamsVisible, setAreTeamsVisible] = useState<Boolean>(false);
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
        <div>
          {teams.map((team) => {
            return (
              <StatsTeamCard
                key={team.id}
                teamName={team.teamName}
                groupId={team.groupId}
                divisionId={team.divisionId}
                logo={team.logo}
                playerList={team.playerList}
              />
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
              setAreTeamsVisible(true);
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

export default StatsTeam;
