import { PlayerOverallStats } from "../../../../types/StatTypes";

const ChampionTopImage = ({ playerData }: { playerData: PlayerOverallStats }) => {
  const topChampion = playerData.championPool[0];
  const championName = topChampion?.championName.toLowerCase();
  if (!championName) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 w-full h-64 hidden md:block">
      <div className="w-full relative h-64">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${topChampion.championName}/splashCentered`}
          alt="Champion Splash Art"
          className="w-full h-full object-cover object-[50%_20%]"
          width={900}
          height={400}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(ellipse 50% 50% at center, transparent 30%, transparent 45%, var(--color-bg-dark) 100%)",
          }}></div>
      </div>
    </div>
  );
};

export default ChampionTopImage;
