import { NavLink, useSearchParams } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";
import useRosterDataQuery from "../../api/useRosterDataQuery";
import Title from "../../components/Title";
import NavSideBar from "../../components/NavSideBar";
import LoadingIcon from "../../components/LoadingIcon";
import Button from "../../components/Button";
import DivisionDisplay from "./components/DivisionDisplay";
import useSeasonsQuery from "../../api/useSeasonsQuery";

function Roster() {
  const { data: seasonData, isLoading: isSeasonsLoading, isError: isSeasonsError } = useSeasonsQuery();
  const { data: rosterData, isLoading: isRosterLoading, isError: isRosterError } = useRosterDataQuery();

  const [params] = useSearchParams();
  const activeLink = params.get("division") ?? undefined;
  const toggleActive = () => {
    // setActiveLink(navItem);
  };
  const navItems = rosterData?.divisions.map((division) => division) ?? [];
  const divisions = rosterData?.divisions ?? [];

  if (isSeasonsLoading || isRosterLoading)
    return (
      <div className="bg-bg-dark text-text-primary flex flex-col md:flex-row grow">
        <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20">
          <Title title="Rosters" />
          <div className="flex flex-col items-center">
            <p className="summary text-lg md:text-xl px-16 py-8 text-center text-text-secondary">
              Check out all the teams in each division, look at the player's or custom team op.ggs!
            </p>
            <div className="flex items-center justify-center w-full">
              <LoadingIcon />
            </div>
          </div>
        </div>
      </div>
    );

  if (isSeasonsError || isRosterError) return <ErrorPage />;

  return (
    <div className="bg-bg-dark text-text-primary flex flex-col md:flex-row grow">
      <NavSideBar activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} param="division" />
      <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-14">
        <p className="text-lg font-bold text-text-secondary">{seasonData?.[0]?.seasonName ?? ""}</p>
        <Title title={activeLink !== undefined ? `Rosters: ${activeLink}` : `Rosters`} />
        {activeLink !== undefined ? (
          <DivisionDisplay teams={rosterData?.teams.filter((team) => team.division === activeLink) ?? []} />
        ) : (
          <div className="flex flex-col items-center">
            <p className="summary text-lg md:text-xl px-16 py-8 text-center text-text-secondary">
              Check out all the teams in each division, look at the player's or custom team op.ggs!
            </p>
            <div className="cardContainer flex flex-col md:grid grid-cols-4 w-full px-4 gap-8">
              {divisions.map((division) => (
                <NavLink key={division} to={{ search: `?division=${division}` }} className="w-full">
                  <Button className="w-full">{division}</Button>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Roster;
