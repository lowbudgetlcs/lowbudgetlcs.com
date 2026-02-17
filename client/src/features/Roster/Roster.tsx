import { NavLink } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";
import useRosterDataQuery from "../../api/useRosterDataQuery";
import Title from "../../components/Title";
import NavSideBar from "../../components/NavSideBar";
import { useState } from "react";

function Roster() {
  const { data: rosterData, isLoading, isError } = useRosterDataQuery();
  const [activeLink, setActiveLink] = useState<string | number | undefined>(undefined);

  const toggleActive = (navItem: string | number) => {
    setActiveLink(navItem);
  };
  const navItems = rosterData?.divisions.map((division) => division) ?? [];
  const divisions = rosterData?.divisions ?? [];

  if (isLoading)
    return (
      <div className="relative bg-bg-dark text-text-primary">
        <div className="title h-64 w-full flex items-center justify-center">
          <Title title="Rosters" />
        </div>
      </div>
    );

  if (isError) return <ErrorPage />;

  return (
    <div className="bg-bg-dark text-text-primary flex flex-col md:flex-row grow">
      <NavSideBar activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <Title title="Rosters" />
        <div className="flex flex-col items-center">
          <p className="summary text-lg md:text-xl px-16 py-8 text-center text-text-secondary">
            Check out all the teams in each division, look at the player's or custom team op.ggs!
          </p>
          <div className="cardContainer flex flex-col md:grid grid-cols-4 w-full px-4 gap-8">
            {divisions.map((division) => (
              <NavLink
                key={division}
                to={`/rosters/${division}`}
                className={`relative card cursor-pointer bg-orange flex items-center justify-center min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 dark:before:bg-light-gray before:z-0 before:absolute hover:before:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}>
                <h2 className="z-10 text-3xl text-white text-center font-semibold">{division}</h2>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Roster;
