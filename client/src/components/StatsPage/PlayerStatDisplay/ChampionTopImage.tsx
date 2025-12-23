import { PlayerOverallStats } from "../../../types/StatTypes";

const ChampionTopImage = ({ playerData }: { playerData: PlayerOverallStats }) => {
  const championName = playerData.championPool[0].championName.toLowerCase();
  if (!championName) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 w-full h-64 hidden md:block">
      <div className="w-full relative h-64">
        <img
          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/skins/base/images/${championName}_splash_centered_0.jpg`}
          alt="Champion Splash Art"
          className="w-full h-full object-cover object-[50%_20%]"
          width={900}
          height={400}
        />
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute top-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black"></div>
      </div>
    </div>
  );
};

export default ChampionTopImage;
