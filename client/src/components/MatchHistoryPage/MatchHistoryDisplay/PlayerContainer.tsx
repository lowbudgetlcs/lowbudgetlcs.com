import { ParticipantDto } from "../interfaces/MatchV5";
import PlayerInfo from "./RuneDisplay/PlayerInfo";
import Runes from "./RuneDisplay/Runes";
import SummonerSpellsDisplay from "./SummonerSpellsDisplay";

const PlayerContainer = ({ playerData }: { playerData: ParticipantDto }) => {
  return (
    <div className="playerContainer flex gap-2 items-center">
      <div className="champPlayerInfo flex gap-2 items-center justify-around">
        <PlayerInfo playerData={playerData} />
        <div className="playerBuild flex gap-2">
          <SummonerSpellsDisplay playerData={playerData} />
          <Runes playerData={playerData} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContainer;
