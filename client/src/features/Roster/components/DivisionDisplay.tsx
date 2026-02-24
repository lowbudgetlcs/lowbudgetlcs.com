import { useState } from "react";
import { RosterData } from "../../../types/RosterTypes";
import TeamCard from "./TeamCard";

const DivisionDisplay = ({ teams }: { teams: RosterData["teams"] }) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const handleCardToggle = (teamName: string) => {
    setOpenCardId(openCardId === teamName ? null : teamName);
  };
  return (
    <div className="flex flex-col lg:grid grid-cols-2 items-center gap-4 overflow-y-scroll max-h-[60vh]">
      {teams.map((team) => (
        <TeamCard
          key={team.name}
          teamName={team.name}
          division={team.division}
          logo={team.logo ?? null}
          playerList={team.players}
          isOpen={openCardId === team.name}
          onToggle={() => handleCardToggle(team.name)}
        />
      ))}
    </div>
  );
};

export default DivisionDisplay;
