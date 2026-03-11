import { LuSwords } from "react-icons/lu";
import IndividualStatCard from "./IndividualStatCard";
import { MdAttachMoney } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { FaHandshake, FaSkull } from "react-icons/fa";
import { GiMineExplosion } from "react-icons/gi";
import { ChampionStat } from "../../../../types/StatTypes";

const ChampionStatCard = ({ champ }: { champ: ChampionStat }) => {
  return (
    <div
      key={champ.championName}
      className="championContainer border border-border bg-bg-light rounded-md p-4 text-text-primary">
      <div className="flex gap-2 border-b border-border pb-2 mb-4">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${champ.championName}/square`}
          width={"50px"}
          height={"50px"}
          alt={champ.championName}></img>
        <div className="champText flex justify-between items-center w-full bg-">
          <div>
            <p className="font-bold">{champ.championName}</p>
            <p className="text-text-secondary">{champ.games} Games</p>
          </div>
          <p>
            Win Rate:
            <span className={champ.winrate >= 50 ? "text-blue" : "text-red"}>
              {" "}
              {champ.winrate.toFixed(0)}%
            </span>
          </p>
        </div>
      </div>
      <div className="smallStatBoxesChamp flex md:grid flex-col grid-rows-2 sm:grid-cols-2 gap-4">
        {/* KDA */}
        <IndividualStatCard
          icon={<LuSwords className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-green/70"
          title="KDA Ratio"
          value={champ.kda.toFixed(2)}
          valueColor={champ.kda >= 2 ? "text-blue" : champ.kda <= 1 ? "text-red" : "text-text-primary"}
        />
        {/* Damage/Min */}
        <IndividualStatCard
          icon={<GiMineExplosion className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-purple/70"
          title="DMG/Min"
          value={champ.avgDamagePerMin.toFixed(0)}
        />
        {/* Deaths/Game */}
        <IndividualStatCard
          icon={<FaSkull className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-slate-500/70"
          title="Deaths/Game"
          value={champ.avgDeaths.toFixed(1)}
          valueColor={champ.avgDeaths <= 4 ? "text-blue" : "text-red"}
        />
        {/* KP */}
        <IndividualStatCard
          icon={<FaHandshake className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-pink-500/70"
          title="Kill Participation"
          value={champ.avgKillParticipation.toFixed(0) + "%"}
          valueColor={champ.avgKillParticipation >= 49.5 ? "text-blue" : "text-red"}
        />
        {/* CS/Game */}
        <IndividualStatCard
          icon={<BsGraphUp className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-green/70"
          title="CS/Min"
          value={champ.avgCsPerMin.toFixed(1)}
        />

        {/* Gold/Game */}
        <IndividualStatCard
          icon={<MdAttachMoney className="text-white w-6.25 h-6.25" />}
          iconBgColor="bg-yellow/70"
          title="Gold/Min"
          value={champ.avgGoldPerMin.toFixed(1)}
        />
      </div>
    </div>
  );
};

export default ChampionStatCard;
