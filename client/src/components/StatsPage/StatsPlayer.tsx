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
    // Use import.meta.glob to dynamically import all champion images
    const modules = import.meta.glob("../../assets/champion/*.png");
    const images: Record<string, string> = {};

    // Load each image and populate the images object
    const loadImages = async () => {
      for (const path in modules) {
        const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0]; // Extract the filename without extension
        if (name) {
            const module = (await modules[path]()) as { default: string };
          images[name] = module.default;
        }
      }
      setChampImages(images); // Update state once all images are loaded
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

  console.log(allGameData);

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
            <div key={game.id} className="gameContainer w-full min-h-44 md:h-44 py-8 bg-gray flex flex-col md:flex-row rounded-md">
              <div className="gameInfo flex flex-col md:px-4 items-center justify-center gap-2 py-2">
                <h2>{game.win ? "Win" : "Loss"}</h2>
                <div className="line h-1 w-16 rounded-md bg-orange"></div>
                <h2>gameLength</h2>
              </div>
              <div className="champKDA flex flex-col gap-2 py-2 md:px-4 items-center justify-center m-4">
                <img
                  src={champImageSrc}
                  className="champion min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] bg-dark-blue"
                />
                <p className="text-xl font-semibold">k/d/a</p>
              </div>
              <div className="fullStats flex flex-col md:flex-row gap-4">
                <div className="goldStats flex flex-col gap-2 items-center md:items-start justify-center">
                  <p className="text-base">
                    CS: <span className="text-white/60">400</span>
                  </p>
                  <p className="text-base">
                    CS/M: <span className="text-white/60">12</span>
                  </p>
                  <p className="text-base">
                    Gold: <span className="text-white/60">300000</span>
                  </p>
                  <p className="text-base">
                    Vision Score: <span className="text-white/60">200</span>
                  </p>
                </div>
                <div className="damageStats flex flex-col gap-2 items-center md:items-start justify-center">
                  <p className="text-base">
                    Damage: <span className="text-white/60">5023443</span>
                  </p>
                  <p className="text-base">
                    Healing: <span className="text-white/60">5023512</span>
                  </p>
                  <p className="text-base">
                    Shielding: <span className="text-white/60">502343</span>
                  </p>
                  <p className="text-base">
                    Damage to Turrets:{" "}
                    <span className="text-white/60">201442</span>
                  </p>
                </div>
                <div className="defenceStats flex flex-col gap-2 items-center md:items-start justify-center">
                  <p className="text-base">
                    Damage Taken:{" "}
                    <span className="text-white/60">23424642</span>
                  </p>
                  <p className="text-base">
                    Self-Mitigated:{" "}
                    <span className="text-white/60">3453452</span>
                  </p>
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
