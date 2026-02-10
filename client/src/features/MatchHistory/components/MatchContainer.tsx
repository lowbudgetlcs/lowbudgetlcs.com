import { useState } from "react";
import { ParticipantDto, TeamDto } from "../../../types/MatchV5";
import NavList from "../../../layout/NavList";
import TeamContainer from "./TeamContainer";

const MatchContainer = ({
  blueTeam,
  redTeam,
  blueTeamPlayers,
  redTeamPlayers,
}: {
  blueTeam: TeamDto;
  redTeam: TeamDto;
  blueTeamPlayers: ParticipantDto[];
  redTeamPlayers: ParticipantDto[];
}) => {
  const [activeLink, setActiveLink] = useState<string>("Loadout/KDA");

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  const navItems = ["Loadout/KDA", "Graphs", "Stat List"];

  return (
    <div className="stats flex flex-col bg-bg rounded-xl lg:p-4">
      <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} grow={true} />
      <div className="teamContainers flex flex-col lg:flex-row gap-4">
      <TeamContainer team={blueTeam} teamPlayers={blueTeamPlayers} activeLink={activeLink} />
      <TeamContainer team={redTeam} teamPlayers={redTeamPlayers} activeLink={activeLink} />
      </div>
    </div>
  );
};
export default MatchContainer;
