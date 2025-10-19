import { useState } from "react";
import getTeamsBySeason from "../dataHandlers/getTeamsBySeason";
import NavList from "../../NavList";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "../../LoadingIcon";
import { useNavigate } from "react-router-dom";

const TeamList = ({ activeSeason }: { activeSeason: number }) => {
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState<string>("Economy");
  const [navItems, setNavItems] = useState<string[]>([]);

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  const { isPending, data, error, isError, isSuccess } = useQuery({
    queryKey: ["teams", activeSeason],
    queryFn: () => getTeamsBySeason(activeSeason),
  });

  if (isPending) {
    return (
      <div className="loading min-w-64 flex items-center justify-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  if (isError) {
    console.error(error);
    navigate("/");
    return null;
  }

  if (isSuccess && navItems.length === 0) {
    setNavItems(data.divisions.map((division) => division.divisionName));
  }
  return (
    <div className="flex flex-col teamList items-center justify-center text-white mt-20">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      <div className="flex flex-col md:grid grid-cols-2 gap-4 p-4">
        {data.teams.map((team) => {
          if (team.divisions.divisionName === activeLink)
            return (
              <div
                key={team.teams.id}
                className={`teamCard relative transition duration-300 rounded-md bg-gray/80 dark:bg-gray/40`}>
                <div className="flex flex-col md:flex-row py-4 md:py-0 md:pl-4 gap-4 items-center max-w-md md:max-w-full md:w-full h-32 overflow-hidden">
                  <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
                    {team.teams.logo ? (
                      <img
                        src={team.teams.logo}
                        className="logo flex-shrink-0 w-[100px] text-center text-xl h-[100px]"
                      />
                    ) : (
                      <div className="logo flex-shrink-0 w-[100px] text-center text-xl h-[100px] bg-gray">
                        No logo 😢
                      </div>
                    )}
                    <div className={`w-full h-3 md:w-3 md:h-full bg-orange`}></div>
                  </div>
                  <div className="flex flex-col md:flex-row flex-1 flex-shrink items-center">
                    <h3 className="teamName text-xl text-center md:text-left font-semibold px-4 md:px-4">
                      {team.teams.teamName}
                    </h3>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default TeamList;
