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

  if (!state?.gameData || state.gameData.length === 0) {
    console.log("no player");
    navigate("/stats");
    return null;
  }

  const allGameData: Game[] = state.gameData.flat();
  const summonerName = state.summonerName

  console.log(allGameData);

  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 mt-40 sm:mt-24 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="placeHolderImage min-w-[160px] min-h-[160px] bg-gray text-center">Placeholder Image</div>
        <h1 className="text-6xl text-center">{summonerName}</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
      </div>
    </div>
  );
}

export default StatsPlayer;
