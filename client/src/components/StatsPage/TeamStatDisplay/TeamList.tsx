import { useEffect, useState } from "react";
import getTeamsBySeason from "../dataHandlers/getTeamsBySeason";
import { Team } from "../../../types/RosterTypes";
import NavList from "../../NavList";

const TeamList = ({ activeSeason }: { activeSeason: number }) => {
  const [activeLink, setActiveLink] = useState<string>("Economy");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [navItems, setNavItems] = useState<string[]>([]);

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTeamsBySeason(activeSeason);
        if (response) {
          setTeams(response.teams);
          setNavItems(response.divisions)
          setLoading(false);
        } else {
          setError("No teams found.");
        }
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [activeSeason]);

  return (
    <div className="flex flex-col teamList items-center justify-center">
      <div className="navContainer flex">
        <NavList
          activeLink={activeLink}
          toggleActive={toggleActive}
          navItems={navItems}
        />
      </div>
      <div></div>
    </div>
  );
};

export default TeamList;
