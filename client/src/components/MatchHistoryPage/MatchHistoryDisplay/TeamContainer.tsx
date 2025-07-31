import { useState } from "react";
import { ParticipantDto, TeamDto } from "../interfaces/MatchV5";
import PlayerContainer from "./PlayerContainer";
import NavList from "../../NavList";

const TeamContainer = ({ team, players }: { team: TeamDto; players: ParticipantDto[] }) => {
  const [activeLink, setActiveLink] = useState<string>("[Default Link]");

  const dragonIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon.png`;
  const baronIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/baron.png`;
  const towerIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/icon_ui_tower_minimap.png`;
  const grubsIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png`;
  const inhibitorIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/inhibitor.png`;
  const atakhanIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/atakhan_r.png`;
  const heraldIcon = `https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/riftherald.png`;

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  const navItems = ["Loadout/KDA", "Damage", "Defense", "Economy"];

  return (
    <div className="teamContainer flex flex-col bg-gray rounded-md p-4">
      <div className="teamTitle flex gap-2 items-center">
        <h3 className={`${team.win ? "text-green brightness-125" : "text-red"} font-bold text-2xl`}>
          {team.win ? "Victory" : "Defeat"}
        </h3>
        <p className="text-white/60">{team.teamId === 100 ? "Blue" : "Red"} Team</p>
      </div>
      <div className="objectives flex gap-4 items-center">
        <h3>Objectives:</h3>
        <div className="dragon flex items-center">
          <img src={dragonIcon} className="h-8"></img>
          <p>{team.objectives.dragon.kills}</p>
        </div>
        <div className="grubs flex items-center">
          <img src={grubsIcon} className="h-8"></img>
          <p>{team.objectives.horde.kills}</p>
        </div>
        <div className="baron flex items-center">
          <img src={baronIcon} className="h-8"></img>
          <p>{team.objectives.dragon.kills}</p>
        </div>
        <div className="herald flex items-center">
          <img src={heraldIcon} className="h-8"></img>
          <p>{team.objectives.riftHerald.kills}</p>
        </div>
        <div className="atakhan flex items-center">
          <img src={atakhanIcon} className="h-8"></img>
          <p>{team.objectives.atakhan.kills}</p>
        </div>
        <div className="tower flex items-center">
          <img src={towerIcon} className="h-8"></img>
          <p>{team.objectives.tower.kills}</p>
        </div>
        <div className="inhibitor flex items-center">
          <img src={inhibitorIcon} className="h-8"></img>
          <p>{team.objectives.inhibitor.kills}</p>
        </div>
      </div>
      <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} grow={true} />
      <div className="playerContainer flex flex-col gap-2 grow">
        <PlayerContainer playerData={players[0]} allPlayers={players} />
        <PlayerContainer playerData={players[1]} allPlayers={players} />
        <PlayerContainer playerData={players[2]} allPlayers={players} />
        <PlayerContainer playerData={players[3]} allPlayers={players} />
        <PlayerContainer playerData={players[4]} allPlayers={players} />
      </div>
    </div>
  );
};
export default TeamContainer;
