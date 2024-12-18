import { useLocation, useParams } from "react-router-dom";
interface StatsProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
  isOpen: boolean;
  onToggle: () => void;
}

function StatsTeam() {
      const { teamName, groupId, divisionId, logo, playerList }: StatsProps = useLocation().state;
  return (
    <div className="statsTeamTitle min-h-64 mb-16 mt-40 sm:mt-24 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
      {logo ? (
        <img
          src={logo}
          className="teamLogo w-[160px] h-[160px] text-center"
        ></img>
      ) : (
        <div className="placeholderImg min-w-[160px] min-h-[160px] bg-gray text-center"></div>
      )}

      <h1 className="text-6xl text-center text-white">{teamName}</h1>
    </div>
  );
}

export default StatsTeam;
