import { useEffect, useState } from "react";
import NavList from "../../../../layout/NavList";
import LoadingIcon from "../../../../components/LoadingIcon";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useTeamsBySeasonQuery from "../../api/queries/useTeamsBySeasonQuery";
import lblcsIcon from "../../../../assets/icons/lblcsIcon.svg";

const TeamList = ({ activeSeason }: { activeSeason: number }) => {
  const { isLoading, data, error } = useTeamsBySeasonQuery(activeSeason);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const [navItems, setNavItems] = useState<string[]>([]);
  const [activeLink, setActiveLink] = useState<string>("");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  useEffect(() => {
    if (!data) return;

    const sortedDivisions = [...data.divisions].sort((a, b) => b.eventId - a.eventId);
    const divisionNames = sortedDivisions.map((division) => division.divisionName);

    setNavItems(divisionNames);
    if (divisionNames.length > 0 && !divisionNames.includes(activeLink)) {
      setActiveLink(divisionNames[0]);
    }
  }, [data, activeLink]);

  useEffect(() => {
    setSearchParams({ season: activeSeason.toString() }, { replace: true });
  }, [activeSeason, setSearchParams]);

  if (isLoading) {
    return (
      <div className="loading min-w-64 flex items-center justify-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    console.error(error);
    navigate("/stats");
    return null;
  }

  return (
    <div className="flex flex-col teamList items-center text-white md:mt-14 grow h-full">
      <div className="w-full">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      </div>
      <div className="flex w-full max-w-7xl flex-col md:grid grid-cols-2 xl:grid-cols-3 gap-4 p-4 overflow-y-scroll max-h-[60vh] mt-2">
        {data &&
          data.teams.map((team) => {
            if (team.divisions.divisionName === activeLink && team.teams && team.teams.teamName) {
              return (
                <Link
                  to={`${encodeURIComponent(team.teams.teamName)}`}
                  key={team.teams.id}
                  className="teamCard relative transition duration-300 rounded-xl bg-bg border-border border group w-full">
                  <div className="p-2">
                    <div className="flex flex-col md:flex-row py-4 md:py-0 gap-4 items-center min-h-20 overflow-hidden">
                      <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
                        {team.teams.logo ? (
                          <img src={team.teams.logo} alt={`${team.teams.teamName} logo`} className="logo shrink-0 w-20 text-center text-xl h-20" />
                        ) : (
                          <img src={lblcsIcon} alt="" className="logo shrink-0 w-20 text-center grayscale opacity-60 text-xl h-20" />
                        )}
                        <div className="w-full h-1 md:w-1 md:h-16 bg-orange"></div>
                      </div>
                      <div className="flex flex-col md:flex-row flex-1 shrink md:ml-4 items-center">
                        <h3 className="teamName text-xl text-center md:text-left font-semibold px-16 md:px-8 text-text-primary">{team.teams.teamName}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
      </div>
    </div>
  );
};

export default TeamList;
