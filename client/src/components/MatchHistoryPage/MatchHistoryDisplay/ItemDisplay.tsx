import { ParticipantDto } from "../interfaces/MatchV5";
import itemJson from "../json/items.json";
const ItemDisplay = ({ playerData }: { playerData: ParticipantDto }) => {
  const itemList = [
    playerData.item0,
    playerData.item1,
    playerData.item2,
    playerData.item3,
    playerData.item4,
    playerData.item5,
  ];

  const showWardItem = () => {
    const rawItem = itemJson.find((i) => i.id === playerData.item6);
    if (!rawItem) return null;
    const filename = rawItem.iconPath.split("/").pop();
    // 3. Update the iconPath with the new format
    rawItem.iconPath = `/latest/game/assets/items/Icons2D/${filename}`;
    const correctedItem = rawItem.iconPath.replace(" ", "_").toLowerCase();
    const itemLink = `https://raw.communitydragon.org${correctedItem}`;
    return <img src={itemLink} className="w-8 h-8 border-2 border-gray"></img>;
  };
  return (
    <div className="itemContainer flex gap-0.5 rounded-md p-1">
      <div className="itemContainer grid grid-cols-3 gap-0.5">
        {itemList.map((item, index) => {
          const rawItem = itemJson.find((i) => i.id === item);
          if (!rawItem) return null;
          const filename = rawItem.iconPath.split("/").pop();
          // 3. Update the iconPath with the new format
          rawItem.iconPath = `/latest/game/assets/items/Icons2D/${filename}`;
          const correctedItem = rawItem.iconPath.replace(" ", "_").toLowerCase();
          const itemLink = `https://raw.communitydragon.org${correctedItem}`;
          return <img src={itemLink} key={index} className="w-8 h-8 border-2 border-gray"></img>;
        })}
      </div>
      <div className="relative w-8 h-8">{showWardItem()}
        <p className="absolute -bottom-0 left-2 text-xs rounded-md bg-black px-0.5">{playerData.visionScore}</p>
      </div>
    </div>
  );
};

export default ItemDisplay;
