import { useState } from "react";
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
      const [activeLink, setActiveLink] = useState<string>("Details");

      const toggleActive = (navItem: string) => {
        setActiveLink(navItem);
      };
  return (
    <>
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
    <div className="navList text-white">
            <ul className="relative flex gap-4 text-sm sm:text-base md:text-2xl font-semibold justify-center p-4">
              <li
                onClick={() => toggleActive("Details")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Details
                <span
                  className={`line absolute ${
                    activeLink === "Details" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 right-0`}
                ></span>
              </li>
              <li
                onClick={() => toggleActive("History")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Match History
                <span
                  className={`line absolute ${
                    activeLink === "History" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
                ></span>
              </li>
            </ul>
          </div>
          <div className="detailsSection"></div>
    </>
  );
}

export default StatsTeam;
