import MatchStats from "./interfaces/MatchStats";
import createTeamObject from "./createTeamObject";
import { MatchV5DTOs } from "twisted/dist/models-dto";

const createMatchObject = (matchData: MatchV5DTOs.MatchDto) => {
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
    blueTeam: createTeamObject(teams[0], matchData),
    redTeam: createTeamObject(teams[1], matchData),
    tournamentCode: tournamentCode,
  };
  return matchObject;
};
export default createMatchObject;
