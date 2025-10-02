import { useParams } from "react-router-dom";
import { MatchDto } from "../../../types/MatchV5";
import MHBans from "./MHBans";
import TeamContainer from "./TeamContainer";

const MHMatchDisplay = ({ matchData }: { matchData: MatchDto }) => {
  const params = useParams();
  // Format game duration into minutes and seconds MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const blueTeamPlayers = matchData.info.participants.filter(
    (participant) => participant.teamId === 100
  );

  const redTeamPlayers = matchData.info.participants.filter(
    (participant) => participant.teamId === 200
  );

  return (
    <>
      <div className="flex flex-col gap-2 mt-20 md:p-4">
        <div className="topContainer flex flex-col md:flex-row gap-2 py-4 px-6 bg-gray rounded-md items-center md:items-start md:justify-between">
          <div className="title flex flex-col">
            <h1 className="text-2xl font-bold">Match Details</h1>
            <h2>{matchData.info.gameMode}</h2>
            <p className="text-white/60"> {formatTime(matchData.info.gameDuration)}</p>
            <p className="text-white/60">MatchID: {params.matchID}</p>
          </div>
          <div className="teamBans flex flex-col gap-4 items-center">
            <div className="flex gap-2 items-center">
              <p className="text-blue font-bold">Blue Bans:</p>
              <MHBans banList={matchData.info.teams[0].bans} />
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-red font-bold">Red Bans:</p>
              <MHBans banList={matchData.info.teams[1].bans} />
            </div>
          </div>
        </div>
        <div className="blueTeamContainer">
          <TeamContainer team={matchData.info.teams[0]} players={blueTeamPlayers} />
        </div>
        <div className="redTeamContainer">
          <TeamContainer team={matchData.info.teams[1]} players={redTeamPlayers} />
        </div>
      </div>
    </>
  );
};

export default MHMatchDisplay;
