import { TeamDto } from "../../../../types/MatchV5";

const dragonIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon.png`;
const baronIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/baron.png`;
const towerIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/icon_ui_tower_minimap.png`;
const grubsIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png`;
const inhibitorIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/inhibitor.png`;
const atakhanIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/atakhan_r.png`;
const heraldIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/riftherald.png`;

const Objectives = ({ team, season }: { team: TeamDto, season: string }) => {
  return (
    <div className="objectives grid grid-cols-4 md:flex gap-4 items-center px-4 md:px-0">
      <h3>Objectives:</h3>
      <div className="dragon flex items-center">
        <img src={dragonIcon} className="h-8" alt="Dragon" />
        <p>{team.objectives.dragon.kills}</p>
      </div>
      <div className="grubs flex items-center">
        <img src={grubsIcon} className="h-8" alt="Grubs" />
        <p>{team.objectives.horde.kills}</p>
      </div>
      <div className="baron flex items-center">
        <img src={baronIcon} className="h-8" alt="Baron" />
        <p>{team.objectives.baron.kills}</p>
      </div>
      <div className="herald flex items-center">
        <img src={heraldIcon} className="h-8" alt="Rift Herald" />
        <p>{team.objectives.riftHerald.kills}</p>
      </div>
     { season === "15" && <div className="atakhan flex items-center">
        <img src={atakhanIcon} className="h-8" alt="Atakhan" />
        <p>{team.objectives.atakhan.kills}</p>
      </div>}
      <div className="tower flex items-center">
        <img src={towerIcon} className="h-8" alt="Tower" />
        <p>{team.objectives.tower.kills}</p>
      </div>
      <div className="inhibitor flex items-center">
        <img src={inhibitorIcon} className="h-8" alt="Inhibitor" />
        <p>{team.objectives.inhibitor.kills}</p>
      </div>
    </div>
  );
};

export default Objectives;
