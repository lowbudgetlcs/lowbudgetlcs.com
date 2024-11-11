import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Game {
  id: number;
  kills: number;
  deaths: number;
  assists: number;
  level: number;
  gold: number;
  visionScore: number;
  damage: number;
  healing: number;
  shielding: number;
  damageTaken: number;
  selfMitigatedDamage: number;
  damageToTurrets: number;
  longestLife: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  gameLength: number;
  win: boolean;
  cs: number;
  championName: string;
  teamKills: number;
  shortCode: string;
  performanceId: number;
}

interface LocationState {
  gameData: Game[][];
  summonerName: string;
}

function StatsPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [champImages, setChampImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const modules = import.meta.glob("../../assets/champion/*.png");
    const images: Record<string, string> = {};

    const loadImages = async () => {
      for (const path in modules) {
        const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
        if (name) {
          const module = (await modules[path]()) as { default: string };
          images[name] = module.default;
        }
      }
      setChampImages(images);
    };

    loadImages();
  }, []);

  if (!state?.gameData || state.gameData.length === 0) {
    console.log("no player");
    navigate("/stats");
    return null;
  }

  const allGameData: Game[] = state.gameData.flat();
  const summonerName = state.summonerName;

  const handleTime = (gameLength: number) => {
    const minutes = Math.floor(gameLength / 60);
    let seconds = gameLength - minutes * 60;
    let stringSeconds = seconds.toString()
    if (seconds === 0) {
        stringSeconds = '00'
    }
    const time = minutes + ':' + stringSeconds
    return time
}
  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title min-h-64 mb-16 mt-40 sm:mt-24 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="placeHolderImage min-w-[160px] min-h-[160px] bg-gray text-center">
          Placeholder Image
        </div>
        <h1 className="text-6xl text-center">{summonerName}</h1>
      </div>
      <div className="flex flex-col items-center py-8 px-4 gap-8">
        {allGameData.map((game) => {
          const champImageSrc = champImages[game.championName] || 'default.png';
          return (
            <div key={game.id} className="gameContainer w-full md:h-44 py-8 bg-gray flex flex-col md:flex-row rounded-md lg:max-w-[78%]">
              <div className="gameInfo flex flex-col items-center justify-center gap-2 py-2 w-full md:w-24 px-4 text-left">
                <h2>{game.win ? "Win" : "Loss"}</h2>
                <div className="line h-1 w-16 rounded-md bg-orange"></div>
                <h2>{handleTime(game.gameLength)}</h2>
              </div>
              <div className="champKDA flex flex-col gap-2 py-2 items-center justify-center w-full md:w-48 text-left">
                <img
                  src={champImageSrc}
                  alt={game.championName}
                  className="champion min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] bg-dark-blue"
                />
                <p className="text-xl font-semibold">{game.kills}/{game.deaths}/{game.assists}</p>
              </div>
              {/* Container to align stats consistently across all screen sizes */}
              <div className="fullStats flex flex-col md:flex-row gap-4 items-center justify-center w-fit md:w-1/2 text-left m-auto md:m-4 pt-4 flex-grow">
                <div className="statsContainer flex flex-col gap-2 md:flex-row w-full items-center">
                  <div className="goldStats flex flex-col gap-2 items-start justify-center w-full md:w-1/3">
                    <p className="text-sm">CS: <span className="text-white/60">{game.cs}</span></p>
                    <p className="text-sm">CS/m: <span className="text-white/60">{(game.cs / 60).toFixed(1)}</span></p>
                    <p className="text-sm">Gold: <span className="text-white/60">{game.gold}</span></p>
                    <p className="text-sm">Vision Score: <span className="text-white/60">{game.visionScore}</span></p>
                  </div>
                  <div className="damageStats flex flex-col gap-2 items-start justify-center w-full md:w-1/3">
                    <p className="text-sm">Damage: <span className="text-white/60">{game.damage}</span></p>
                    <p className="text-sm">Healing: <span className="text-white/60">{game.healing}</span></p>
                    <p className="text-sm">Shielding: <span className="text-white/60">{game.shielding}</span></p>
                  </div>
                  <div className="defenceStats flex flex-col gap-2 items-start justify-center w-full md:w-1/3">
                    <p className="text-sm">Damage Taken: <span className="text-white/60">{game.damageTaken}</span></p>
                    <p className="text-sm">Self-Mitigated: <span className="text-white/60">{game.selfMitigatedDamage}</span></p>
                  </div>
                </div>
              </div>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsPlayer;
