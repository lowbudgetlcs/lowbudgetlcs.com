import { ParticipantDto } from "../../../../types/MatchV5";
import ItemDisplay from "../../../../components/ItemDisplay";
import PlayerInfo from "../PlayerInfo";
import Runes from "../../../../components/RuneDisplay/Runes";
import SummonerSpellsDisplay from "../../../../components/SummonerSpellsDisplay";

interface PlayerContainerProps {
  playerData: ParticipantDto;
  allPlayers: ParticipantDto[];
  activeLink: string;
}

const PlayerContainer = ({ playerData, allPlayers, activeLink }: PlayerContainerProps) => {
  const totalKills = allPlayers.reduce((total, player) => total + player.kills, 0);
  let killParticipation = 0;
  if (totalKills > 0) {
    const rawKP = ((playerData.kills + playerData.assists) / totalKills) * 100;
    killParticipation = Number(rawKP.toFixed(0));
  }
  return (
    <div className="playerContainer bg-bg-light p-2 rounded-md border border-border">
      <div className="champPlayerInfo flex items-center justify-between">
        <PlayerInfo playerData={playerData} />
        {activeLink === "Loadout/KDA" ? (
          <>
            <div className="playerBuild flex gap-2 shrink-0 w-18">
              <SummonerSpellsDisplay playerData={playerData} />
              <Runes playerData={playerData} />
            </div>
            <div className="itemDisplay shrink-0 w-36">
              <ItemDisplay playerData={playerData} />
            </div>
            <div className="kda flex flex-col items-center shrink-0 w-28">
              <div className="flex font-bold justify-center text-lg">
                <p>{playerData.kills}</p>&nbsp;/&nbsp;
                <p className="text-red">{playerData.deaths}</p>
                &nbsp;/&nbsp;
                <p>{playerData.assists}</p>
              </div>
              <p
                className={`font-bold text-sm ${
                  killParticipation > 50 ? "text-green" : killParticipation < 50 && killParticipation > 30 ? "text-yellow" : "text-red"
                }`}>
                {killParticipation}% KP
              </p>
            </div>
            <div className="flex flex-col text-center shrink-0 w-28">
              <p className="cs font-bold">{playerData.totalMinionsKilled + playerData.neutralMinionsKilled} <span className="text-text-secondary">CS</span></p>
            </div>
          </>
        ) : (
          activeLink === "Damage"
        )}
      </div>
    </div>
  );
};

export default PlayerContainer;
