import { useState } from "react";
import getTeamsBySeason from "../../api/getTeamsBySeason";
import NavList from "../../../../components/NavList";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "../../../../components/LoadingIcon";
import { Link, useNavigate } from "react-router-dom";

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
    navigate("/stats");
    return null;
  }

  if (isSuccess && navItems.length === 0) {
    const sortedDivisions = data.divisions.sort((a, b) => b.eventId - a.eventId)
    setNavItems(sortedDivisions.map((division) => division.divisionName));
  }
  return (
    <div className="flex flex-col teamList items-center text-white mt-20 grow min-h-[80vh]">
      <div className="w-full">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      </div>
      <div className="flex flex-col md:grid grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {data.teams.map((team) => {
          if (team.divisions.divisionName === activeLink)
            return (
              <Link
                to={`${encodeURIComponent(team.teams.teamName)}`}
                key={team.teams.id}
                className={`teamCard relative transition duration-300 rounded-md bg-gray/80 dark:bg-gray/40 w-64 lg:w-[24rem]`}>
                <div className="flex flex-col md:flex-row py-2 md:py-0 md:pl-4 gap-2 items-center justify-center max-w-md md:max-w-full md:w-full h-40 md:h-32 overflow-hidden">
                  <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
                    {team.teams.logo ? (
                      <img
                        src={team.teams.logo}
                        className="logo shrink-0 w-20 text-center text-xl h-20"
                      />
                    ) : (
                      <div className="logo shrink-0 w-20 text-center text-xl h-20 bg-gray">
                        No logo 😢
                      </div>
                    )}
                    <div className={`w-full h-1 md:w-1 md:h-full bg-orange`}></div>
                  </div>
                  <div className="flex flex-col md:flex-row flex-1 shrink items-center">
                    <h3 className="teamName text-lg text-center md:text-left font-semibold">
                      {team.teams.teamName}
                    </h3>
                  </div>
                </div>
              </Link>
            );
        })}
      </div>
    </div>
  );
};

export default TeamList;
