import { RiotAPITypes } from "@fightmegg/riot-api";
import MatchStats from "./interfaces/MatchStats";
import createTeamObject from "./createTeamObject";

const createMatchObject = (matchData: RiotAPITypes.MatchV5.MatchDTO) => {
  const { metadata, info } = matchData;
  const { teams, participants, tournamentCode } = info;
  const matchObject: MatchStats = {
    matchId: metadata.matchId,
    participants: metadata.participants,
    gameId: info.gameId,
    gameMode: info.gameMode,
    gameName: info.gameName,
    gameVersion: info.gameVersion,
    gameDuration: info.gameDuration,
    gameStartTimestamp: info.gameStartTimestamp,
    gameEndTimestamp: info.gameEndTimestamp,
    blueTeam: createTeamObject(teams[0]),
    redTeam: createTeamObject(teams[1]),
    tournamentCode: tournamentCode,
  };
  return matchObject;
};
export default createMatchObject;
