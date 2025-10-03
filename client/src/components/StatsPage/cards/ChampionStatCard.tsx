import { LuSwords } from "react-icons/lu";
import IndividualStatCard from "./IndividualStatCard";
import { MdAttachMoney } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { ChampionStat } from "../../../types/StatTypes";
import { FaCrown } from "react-icons/fa";

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
        <div className="champText flex justify-between items-center w-full">
          <div>
            <p className="font-bold">{champ.championName}</p>
            <p className="opacity-55">{champ.games} Games</p>
          </div>
          <p>
            Win Rate:
            <span className={champ.winrate >= 50 ? "text-blue-400" : "text-red-400"}>
              {champ.winrate.toFixed(0)}%
            </span>
          </p>
        </div>
      </div>
      <div className="smallStatBoxesChamp flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Win Rate */}
        <IndividualStatCard
          icon={<FaCrown className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-purple bg-opacity-50"
          title="Winrate"
          value={champ.winrate.toFixed(0) + "%"}
          valueColor={champ.winrate >= 50 ? "text-blue" : "text-red"}
        />
        {/* KDA */}
        <IndividualStatCard
          icon={<LuSwords className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-red bg-opacity-50"
          title="KDA Ratio"
          value={champ.kda.toFixed(2)}
          valueColor={champ.kda >= 2 ? "text-blue" : champ.kda <= 1 ? "text-red" : "text-white"}
        />
        {/* CS/Game */}
        <IndividualStatCard
          icon={<BsGraphUp className="text-white w-[25px] h-[25px]" />}
          iconBgColor="bg-green bg-opacity-50"
          title="CS/Game"
          value={champ.avgCs.toFixed(0)}
        />
      </div>
    </div>
  );
};

export default ChampionStatCard;
