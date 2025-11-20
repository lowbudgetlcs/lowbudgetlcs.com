import { LuSwords } from "react-icons/lu";
import IndividualStatCard from "./IndividualStatCard";
import { MdAttachMoney } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { ChampionStat } from "../../../types/StatTypes";
import { FaHandshake, FaSkull } from "react-icons/fa";
import { GiMineExplosion } from "react-icons/gi";

const ChampionStatCard = ({ champ }: { champ: ChampionStat }) => {
  return (
    <div
      key={champ.championName}
      className="championContainer border-2 border-gray bg-gray rounded-md bg-opacity-20 p-4">
      <div className="flex gap-2 border-gray pb-2">
        <img
          src={`https://cdn.communitydragon.org/latest/champion/${champ.championName}/square`}
          width={"50px"}
          height={"50px"}
          alt={champ.championName}></img>
        <div className="champText flex justify-between items-center w-full bg-">
          <div>
            <p className="font-bold">{champ.championName}</p>
            <p className="opacity-55">{champ.games} Games</p>
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
          icon={<LuSwords className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-red bg-opacity-50"
          title="KDA Ratio"
          value={champ.kda.toFixed(2)}
          valueColor={champ.kda >= 2 ? "text-blue" : champ.kda <= 1 ? "text-red" : "text-white"}
        />
        {/* Damage/Min */}
        <IndividualStatCard
          icon={<GiMineExplosion className="text-white w-[25px] h-[25px] bg-" />}
          iconBgColor="bg-purple bg-opacity-50"
          title="DMG/Min"
          value={champ.avgDamagePerMin.toFixed(0)}
        />
        {/* Deaths/Game */}
        <IndividualStatCard
          icon={<FaSkull className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-slate-500 bg-opacity-50"
          title="Deaths/Game"
          value={champ.avgDeaths.toFixed(1)}
          valueColor={champ.avgDeaths <= 4 ? "text-blue" : "text-red"}
        />
        {/* KP */}
        <IndividualStatCard
          icon={<FaHandshake className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-pink-500 bg-opacity-50"
          title="Kill Participation"
          value={champ.avgKillParticipation.toFixed(0) + "%"}
          valueColor={champ.avgKillParticipation >= 49.5 ? "text-blue" : "text-red"}
        />
        {/* CS/Game */}
        <IndividualStatCard
          icon={<BsGraphUp className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-green bg-opacity-50"
          title="CS/Min"
          value={champ.avgCsPerMin.toFixed(1)}
        />

        {/* Gold/Game */}
        <IndividualStatCard
          icon={<MdAttachMoney className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-yellow bg-opacity-50"
          title="Gold/Min"
          value={champ.avgGoldPerMin.toFixed(1)}
        />
      </div>
    </div>
  );
};

export default ChampionStatCard;
