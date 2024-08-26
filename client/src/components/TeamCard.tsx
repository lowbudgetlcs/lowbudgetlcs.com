
interface TeamProps {
    teamName: string;
    groupId: string;
    // captainId: number | null;
    logo: string | null;
    playerList: string[];
  }
  
function TeamCard({teamName, groupId, logo, playerList}: TeamProps) {
  
  
    return (
    <div className="teamCard flex justify-center items-center">
      <div className="teamLogo">{logo}</div>
      <div className="teamName">{teamName}</div>
      <div className="teamMembers">
        <div className="players flex flex-col">{playerList.map((player) => {
                      const summonerName = player.split("#");
                      return (
                        <div key={player}>
                         {summonerName[0]} {"#" + summonerName[1]}
                        </div>
                      );
        })}</div>
      </div>
      <div className="teamGroup">{groupId}</div>
    </div>
  );
}

export default TeamCard;
