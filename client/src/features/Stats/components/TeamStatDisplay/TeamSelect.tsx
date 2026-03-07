import NavSideBar from "../../../../components/NavSideBar";
import TeamList from "./TeamList";
import LoadingIcon from "../../../../components/LoadingIcon";
import { useSearchParams } from "react-router-dom";
import useSeasonsQuery from "../../api/queries/useSeasonsQuery";

const TeamSelect = () => {
  const { isPending, data, error, isError } = useSeasonsQuery();
  const [params] = useSearchParams();

  const activeLinkParam = params.get("season");
  const activeLink = activeLinkParam ? Number(activeLinkParam) : undefined;
  const navItems = data?.map((season) => season.id) ?? [];
  const fallbackSeason = navItems[navItems.length - 1] ?? 15;
  const selectedSeason = activeLink ?? fallbackSeason;

  const toggleActive = () => {
    // URL search params handle active state
  };

  if (isPending) {
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

  return (
    <div className="grow w-full">
      <div className="flex flex-col md:flex-row grow">
        <NavSideBar
          activeLink={activeLink}
          toggleActive={toggleActive}
          navItems={navItems}
          param="season"
          prefix="Season"
          replaceHistory
        />
        <TeamList activeSeason={selectedSeason} />
      </div>
    </div>
  );
};

export default TeamSelect;
