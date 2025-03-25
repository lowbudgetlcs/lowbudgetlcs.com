import { FullPlayerDataProps } from "../statTypes";
import getItems from "./getItems";
import getRunes from "./getRunes";
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
        const primaryRune = getRunes(player.performanceData.keystoneRune);
        const secondaryRune = getRunes(
          player.performanceData.secondaryTree
        ).runeName;
        const itemArray = [
          player.performanceData.item0,
          player.performanceData.item1,
          player.performanceData.item2,
          player.performanceData.item3,
          player.performanceData.item4,
          player.performanceData.item5,
        ];

        return (
          <div
            key={player.playerId}
            className="playerContainer p-4 flex gap-4 justify-center items-center"
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
            <div className="runesSums flex justify-center items-center gap-2">
              {/* Summoner Spells */}
              <div className="summoners flex flex-col gap-2">
                <img
                  className="w-10 border-2 border-black"
                  src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${summoner1}.png`}
                />
                <img
                  className="w-10 border-2 border-black"
                  src={`https://raw.communitydragon.org/latest/game/data/spells/icons2d/${summoner2}.png`}
                />
              </div>
              {/* Runes */}
              {/* Currently the database only stores the Primary tree and not the actuall keystone rune */}
              <div className="runes flex flex-col gap-2">
                <img
                  className="w-10"
                  // src={`https://raw.communitydragon.org/latest/game/assets/perks/styles/${primaryRune.tree}/${primaryRune.runeName}.png`}
                  src={`https://raw.communitydragon.org/latest/game/assets/perks/styles/${primaryRune.runeName}.png`}
                ></img>
                <img
                  className="w-10"
                  src={`https://raw.communitydragon.org/latest/game/assets/perks/styles/${secondaryRune}.png`}
                ></img>
              </div>
            </div>
            <div className="items grid grid-cols-3 grid-rows-2 gap-2">
              {itemArray.map((item) => {
                if (item) {
                  const itemName = getItems(item);
                    return (
                      <img className="w-10"
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${itemName}.png`}
                      />
                    );
                } else {
                  return <div className="box w-10 h-10 bg-gray border-black border-2"/>;
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PlayerStatDisplay;
