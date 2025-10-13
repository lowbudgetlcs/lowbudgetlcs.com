import { useEffect, useState } from "react";
import TeamSidebar from "./TeamSidebar";
import getSeasons from "../dataHandlers/getSeasons";
import { Seasons } from "../../../types/Seasons";
import TeamList from "./TeamList";

const TeamSelect = () => {
  const [activeLink, setActiveLink] = useState<number>();
  const [sidebarShown, setSidebarShown] = useState<boolean>(false);
  const [buttonsShown, setButtonsShown] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<number[]>([]);

  const toggleActive = (navItem: number) => {
    setActiveLink(navItem);
  };

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const gotNavItems: number[] = [];
        const response = await getSeasons();
        if (response.length > 0) {
          response.forEach((season: Seasons) => {
            console.log(season.id);
            gotNavItems.push(season.id);
          });
          setNavItems(gotNavItems);
          setLoading(false);
        } else {
          setError("No seasons found.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  useEffect(() => {
    let timer: number;
    if (activeLink) {
      timer = setTimeout(() => {
        setButtonsShown(false);
        setSidebarShown(true);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [activeLink]);
  return (
    <>
      <div
        className={`allstars flex gap-2 bg-white text-black dark:bg-black dark:text-white flex-col items-center justify-center grow pt-20 transition duration-500 ${
          buttonsShown ? "" : "hidden"
        } ${activeLink ? "opacity-0" : ""}`}
      >
        <div className="title text-4xl text-center">
          <h2>Team Stats: Select a Season</h2>
        </div>
        {/* Navigation */}
        {loading ? (
          <div className="loading min-w-64 flex items-center justify-center">
            <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
          </div>
        ) : (
          <div
            className={`ASNav flex flex-col items-center gap-4 px-4 justify-center grow py-4`}
          >
            <div className="seasonSelect flex justify-center flex-wrap gap-8">
              {navItems.map((navItem) => (
                <button
                  onClick={() => toggleActive(navItem)}
                  className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}
                >
                  Season {navItem}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {sidebarShown && (
        <div className="flex flex-col md:flex-row grow">
          <TeamSidebar
            activeLink={activeLink}
            toggleActive={toggleActive}
            navItems={navItems}
          />
          <TeamList activeSeason={activeLink ? activeLink : 15} />
        </div>
      )}
    </>
  );
};

export default TeamSelect;
