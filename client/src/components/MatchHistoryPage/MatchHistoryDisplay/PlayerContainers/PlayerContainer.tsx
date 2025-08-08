import { ParticipantDto } from "../../interfaces/MatchV5";
import ItemDisplay from "../ItemDisplay";
import PlayerInfo from "../PlayerInfo";
import Runes from "../RuneDisplay/Runes";
import SummonerSpellsDisplay from "../SummonerSpellsDisplay";

interface PlayerContainerProps {
  playerData: ParticipantDto;
  allPlayers: ParticipantDto[];
  activeLink: string;
}

const PlayerContainer = ({ playerData, allPlayers, activeLink }: PlayerContainerProps) => {
  const totalKills = allPlayers.reduce((total, player) => total + player.kills, 0);
  const killParticipation: number = Number(
    ((playerData.kills + playerData.assists) / (totalKills / 100)).toFixed(0)
  );
  return (
    <div className="playerContainer bg-light-gray p-2 h-[90px] w-max grow rounded-md">
      <div className="champPlayerInfo flex gap-2 items-center h-full">
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
              <div className="flex text-2xl font-bold justify-center">
                <p>{playerData.kills}</p>&nbsp;/&nbsp;
                <p className="text-red">{playerData.deaths}</p>
                &nbsp;/&nbsp;
                <p>{playerData.assists}</p>
              </div>
              <p className="text-white/60">K / D / A</p>
            </div>
            <div className="flex flex-col text-center shrink-0 w-28">
              <p className="cs text-2xl font-bold">
                {playerData.totalMinionsKilled + playerData.neutralMinionsKilled}
              </p>
              <p className="text-white/60">CS</p>
            </div>
            <div className="flex flex-col text-center shrink-0 w-32 ">
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
              <p className="text-white/60">Kill Participation</p>
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
