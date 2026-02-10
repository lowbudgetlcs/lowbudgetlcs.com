import { ParticipantDto, TeamDto } from "../../../types/MatchV5";
import DamageContainer from "./PlayerContainers/DamageContainer";
import Objectives from "./PlayerContainers/Objectives";
import PlayerContainer from "./PlayerContainers/PlayerContainer";
import StatList from "./PlayerContainers/StatList";

const TeamContainer = ({team, teamPlayers, activeLink}: {team: TeamDto, teamPlayers: ParticipantDto[], activeLink: string}) => {
  return (
    <div className="team1Container lg:w-1/2 bg-bg border border-border rounded-md p-4 flex flex-col gap-2">
      <div className="teamTitle flex gap-2 items-end p-4 md:p-0">
        <h3 className={`${team.win ? "text-green brightness-125" : "text-red"} font-bold text-2xl`}>{team.win ? "Victory" : "Defeat"}</h3>
        <p className="text-white/60 text-sm">{team.teamId === 100 ? "Blue" : "Red"} Team</p>
      </div>
      <Objectives team={team} />
      <div></div>
      {activeLink === "Loadout/KDA" ? (
        <div className="playerContainer flex flex-col gap-2 w-full overflow-x-scroll no-scrollbar">
          {teamPlayers.map((player) => (
            <PlayerContainer key={player.puuid} playerData={player} allPlayers={teamPlayers} activeLink={activeLink} />
          ))}
        </div>
      ) : activeLink === "Graphs" ? (
        <div className="playerContainer flex flex-col gap-2 w-full">
          <DamageContainer players={teamPlayers} />
        </div>
      ) : (
        <div className="statList flex flex-col gap-2 w-full overflow-x-scroll no-scrollbar">
          <StatList players={teamPlayers} />
        </div>
      )}
    </div>
  );
};
export default TeamContainer;
