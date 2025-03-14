import { useParams } from "react-router-dom";
import { useLeagueData } from "../leagueDataContext";
import { TeamProps } from "../../leagueData";

const SeasonSummary = () => {
  // Get season from URL
  const { season } = useParams();
  const { divisions, teams } = useLeagueData();
  return (
    <div className="text-white py-4">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">Season {season} Summary</h1>
      </div>
      <div className="mainContainer flex flex-col items-center justify-around md:flex-row">
        {/* Top Teams of Season */}
        <div className="topTeamsPerLeague border-2 border-gray rounded-md py-4 bg-gray/40">
          <h2 className="text-2xl font-bold text-center">Top Teams</h2>
          <div className="divisionsContainer">
            {divisions.map((division) => {
              const topTeams: TeamProps[] = [];
              teams.map((team) => {
                if (team.divisionId === division.id) {
                  topTeams.push(team);
                }
              });
              console.log(topTeams);
              if (division.name !== "TEST") {
                return (
                  <div className="flex flex-col py-2 px-4">
                    <h3 className="font-bold border-b-2 border-orange">{division.name}</h3>
                    <div className="team1 flex justify-between gap-4 bg-gray p-0.5">
                      <p>{topTeams[0].name}</p>
                      <p className="text-yellow">1st</p>
                    </div>
                    <div className="team2 flex justify-between gap-4 p-0.5">
                      <p>{topTeams[1].name}</p>
                      <p className="text-white/70">2nd</p>
                    </div>
                    <div className="team3 flex justify-between gap-4 bg-gray p-0.5">
                        <p>{topTeams[2].name}</p>
                        <p className="text-gold-light brightness-75">3rd</p>
                      </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        {/* Recent Matches  */}
        <div className="recentMatches border-2 border-gray rounded-md p-4">
          <h2 className="text-2xl font-bold">Recent Matches</h2>
        </div>
      </div>
    </div>
  );
};

export default SeasonSummary;
