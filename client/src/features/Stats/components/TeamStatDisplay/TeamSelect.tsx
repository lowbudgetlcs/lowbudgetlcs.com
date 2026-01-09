import { useEffect, useState } from "react";
import TeamSidebar from "./TeamSidebar";
import getSeasons from "../../api/getSeasons";
import { Seasons } from "../../../../types/Seasons";
import TeamList from "./TeamList";
import LoadingIcon from "../../../../components/LoadingIcon";
import { useQuery } from "@tanstack/react-query";

const TeamSelect = () => {
  const [activeLink, setActiveLink] = useState<number>();
  const [navItems, setNavItems] = useState<number[]>([]);

  const toggleActive = (navItem: number) => {
    setActiveLink(navItem);
  };

  useEffect(() => {
    if (navItems.length > 0 && !activeLink) {
      setActiveLink(navItems[navItems.length - 1]);
    }
    return () => {};
  }, [navItems, activeLink]);

  const { isPending, data, error, isError, isSuccess } = useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
  });

  if (isPending) {
    console.log("loading");
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
    console.log("checked for nav items");
    const gotNavItems: number[] = [];
    data.forEach((season: Seasons) => {
      gotNavItems.push(season.id);
    });
    setNavItems(gotNavItems);
  }

  return (
    <div className="grow w-full">
      <div className="flex flex-col md:flex-row grow">
        <TeamSidebar activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
        <TeamList activeSeason={activeLink ? activeLink : 15} />
      </div>
    </div>
  );
};

export default TeamSelect;
