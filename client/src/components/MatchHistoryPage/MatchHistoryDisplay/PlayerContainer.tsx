import { ParticipantDto } from "../interfaces/MatchV5";
import ItemDisplay from "./ItemDisplay";
import PlayerInfo from "./PlayerInfo";
import Runes from "./RuneDisplay/Runes";
import SummonerSpellsDisplay from "./SummonerSpellsDisplay";

const PlayerContainer = ({
  playerData,
  allPlayers,
}: {
  playerData: ParticipantDto;
  allPlayers: ParticipantDto[];
}) => {
  const totalKills = allPlayers.reduce((total, player) => total + player.kills, 0);
  const killParticipation: number = Number(
    ((playerData.kills + playerData.assists) / (totalKills / 100)).toFixed(0)
  );
  return (
    <div className="playerContainer flex gap-2 items-center bg-light-gray p-2 w-full rounded-md">
      <div className="champPlayerInfo flex gap-2 items-center grow">
        <PlayerInfo playerData={playerData} />
        <div className="playerBuild flex gap-2">
          <SummonerSpellsDisplay playerData={playerData} />
          <Runes playerData={playerData} />
        </div>
        <div className="itemDisplay">
          <ItemDisplay playerData={playerData} />
        </div>
        <div className="playerStats flex text-2xl font-bold">
          <p>{playerData.kills}</p>/<p className="text-red">{playerData.deaths}</p>/<p>{playerData.assists}</p>
        </div>
        <p className="cs">{playerData.totalMinionsKilled + playerData.neutralMinionsKilled}</p>
        <p
          className={`text-2xl font-bold ${
            killParticipation > 50
              ? "text-green"
              : killParticipation < 50 && killParticipation > 30
              ? "text-yellow"
              : "text-red"
          }`}>
          {killParticipation}%
        </p>
      </div>
    </div>
  );
};

export default PlayerContainer;
