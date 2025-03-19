import { FullPlayerDataProps } from "../statTypes";
import getSummonerSpell from "./getSummonerSpell";

// Because Typescript is dumb
interface PlayerStatDisplayProps {
  currentTeam: FullPlayerDataProps;
}
const PlayerStatDisplay = ({ currentTeam }: PlayerStatDisplayProps) => {
  return (
    <>
      {currentTeam.players.map((player) => {
        const summoner1 = getSummonerSpell(player.performanceData.summoner1);
        const summoner2 = getSummonerSpell(player.performanceData.summoner2);
        return (
          <div
            key={player.playerId}
            className="playerContainer p-4 bg-blue/40 flex gap-4 justify-center items-center"
          >
            {/* Champion */}
            <div className="champion">
              <div className="relative">
                <img
                  className="w-24"
                  src={`https://cdn.communitydragon.org/latest/champion/${player.performanceData.championName.toLowerCase()}/square`}
                />
                <div className="absolute champLevel bottom-0 right-0 px-1 font-bold bg-black rounded-tl-md">
                  {player.performanceData.level}
                </div>
              </div>
            </div>
            <div className="runesSums">
              {/* Summoner Spells */}
              <div className="summoners">
                <img
                  src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${summoner1}.png`}
                />
                <img
                  src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${summoner2}.png`}
                />
              </div>
              <div className="runes">{/* <img src={}></img> */}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PlayerStatDisplay;
