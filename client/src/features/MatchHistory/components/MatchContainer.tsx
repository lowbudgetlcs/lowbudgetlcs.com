import { useState } from "react";
import { ParticipantDto, TeamDto } from "../../../types/MatchV5";
import NavList from "../../../layout/NavList";
import TeamContainer from "./TeamContainer";

const MatchContainer = ({
  blueTeam,
  redTeam,
  blueTeamPlayers,
  redTeamPlayers,
  season,
}: {
  blueTeam: TeamDto;
  redTeam: TeamDto;
  blueTeamPlayers: ParticipantDto[];
  redTeamPlayers: ParticipantDto[];
  season: string;
}) => {
  const [activeLink, setActiveLink] = useState<string>("Loadout/KDA");

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  const navItems = ["Loadout/KDA", "Graphs", "Stat List"];

  return (
    <div className="stats flex flex-col items-center rounded-xl gap-2">
      <div className="w-full lg:w-1/2">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} grow={true} />
      </div>

      <div className="teamContainers flex flex-col lg:flex-row gap-4 w-full">
        <TeamContainer team={blueTeam} teamPlayers={blueTeamPlayers} activeLink={activeLink} season={season} />
        <TeamContainer team={redTeam} teamPlayers={redTeamPlayers} activeLink={activeLink} season={season} />
      </div>
    </div>
  );
};
export default MatchContainer;
