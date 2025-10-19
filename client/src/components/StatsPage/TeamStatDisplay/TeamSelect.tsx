import { useEffect, useState } from "react";
import TeamSidebar from "./TeamSidebar";
import getSeasons from "../dataHandlers/getSeasons";
import { Seasons } from "../../../types/Seasons";
import TeamList from "./TeamList";
import LoadingIcon from "../../LoadingIcon";
import { useQuery } from "@tanstack/react-query";

const TeamSelect = () => {
  const [activeLink, setActiveLink] = useState<number>();
  const [sidebarShown, setSidebarShown] = useState<boolean>(false);
  const [buttonsShown, setButtonsShown] = useState<boolean>(true);
  const [navItems, setNavItems] = useState<number[]>([]);

  const toggleActive = (navItem: number) => {
    setActiveLink(navItem);
  };

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

  const { isPending, data, error, isError, isSuccess } = useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
  });

  if (isPending) {
    console.log("loading")
    return (
      <div className="loading min-w-64 flex items-center justify-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return <div>Error loading seasons.</div>;
  }

  if (isSuccess && navItems.length === 0) {
    console.log("checked for nav items")
    const gotNavItems: number[] = [];
    data.forEach((season: Seasons) => {
      gotNavItems.push(season.id);
    });
    setNavItems(gotNavItems);
  }

  return (
    <div>
      <div
        className={`allstars flex gap-2 bg-white text-black dark:bg-black dark:text-white flex-col items-center justify-center grow pt-20 transition duration-500 ${
          buttonsShown ? "" : "hidden"
        } ${activeLink ? "opacity-0" : ""}`}>
        <div className="title text-4xl text-center">
          <h2>Team Stats: Select a Season</h2>
        </div>
        {/* Navigation */}
        <div className={`ASNav flex flex-col items-center gap-4 px-4 justify-center grow py-4`}>
          <div className="seasonSelect flex justify-center flex-wrap gap-8">
            {navItems.map((navItem) => (
              <button
                key={navItem}
                onClick={() => toggleActive(navItem)}
                className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}>
                Season {navItem}
              </button>
            ))}
          </div>
        </div>
      </div>
      {sidebarShown && (
        <div className="flex flex-col md:flex-row grow">
          <TeamSidebar activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
          <TeamList activeSeason={activeLink ? activeLink : 15} />
        </div>
      )}
    </div>
  );
};

export default TeamSelect;
