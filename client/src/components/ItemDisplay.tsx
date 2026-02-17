import { useQuery } from "@tanstack/react-query";
import { ParticipantDto } from "../types/MatchV5";
import LoadingIcon from "./LoadingIcon";

interface ItemProps {
  id: number;
  name: string;
  description: string;
  active: boolean;
  inStore: boolean;
  from: number[];
  to: number[];
  categories: string[];
  maxStacks: number;
  requiredChampion: string;
  requiredAlly: string;
  requiredBuffCurrencyName: string;
  requiredBuffCurrencyCost: number;
  specialRecipe: number;
  isEnchantment: boolean;
  price: number;
  priceTotal: number;
  displayInItemSets: boolean;
  iconPath: string;
}

const ItemDisplay = ({ playerData }: { playerData: ParticipantDto }) => {
  const itemsQuery = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const itemList: ItemProps[] = await response.json();
      return itemList;
    },
  });

  if (itemsQuery.isLoading) {
    return <LoadingIcon />;
  }

  if (itemsQuery.isError || !itemsQuery.data) {
    return <div>Error loading items</div>;
  }
  const itemList = [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5];

  const showWardItem = () => {
    const rawItem = itemsQuery.data.find((i) => i.id === playerData.item6);
    if (!rawItem) return null;
    const filename = rawItem.iconPath.split("/").pop();
    const iconPath = `/latest/game/assets/items/Icons2D/${filename}`;
    const correctedItem = iconPath.replace(" ", "_").toLowerCase();
    const itemLink = `https://raw.communitydragon.org${correctedItem}`;
    return <img src={itemLink} className="w-6 h-6 md:w-8 md:h-8 border-2 border-border"></img>;
  };
  return (
    <div className="itemContainer flex gap-0.5 rounded-md p-1">
      <div className="itemContainer grid grid-cols-3 gap-0.5">
        {itemList.map((item, index) => {
          const rawItem = itemsQuery.data.find((i) => i.id === item);
          if (!rawItem) return <div key={index} className="w-6 h-6 md:w-8 md:h-8 border border-border bg-light-gray light:bg-gray"></div>;
          const filename = rawItem.iconPath.split("/").pop();
          rawItem.iconPath = `/latest/game/assets/items/Icons2D/${filename}`;
          const correctedItem = rawItem.iconPath.replace(" ", "_").toLowerCase();
          const itemLink = `https://raw.communitydragon.org${correctedItem}`;
          return <img src={itemLink} key={index} className="w-6 h-6 md:w-8 md:h-8 border border-border"></img>;
        })}
      </div>
      <div className="relative w-6 h-6 md:w-8 md:h-8">
        {showWardItem()}
        <p className="absolute bottom-0.5 right-0.5 text-[8px] md:text-xs bg-black text-white px-0.5">{playerData.visionScore}</p>
      </div>
    </div>
  );
};

export default ItemDisplay;
