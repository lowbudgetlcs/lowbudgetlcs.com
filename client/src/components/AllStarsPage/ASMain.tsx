import { useEffect, useState } from "react";
import ASTitlePopup from "./ASTitlePopup";
import { useLocalStorageState } from "../../hooks/uselocalStorageState";
import ASSidebar from "./ASSidebar";
import ASContent from "./ASContent";

function ASMain() {
  const [activeLink, setActiveLink] = useState<number>();
  // const [sidebarShown, setSidebarShown] = useLocalStorageState<boolean>("ASsidebarShown", false);
  // const [buttonsShown, setButtonsShown] = useLocalStorageState<boolean>("ASbuttonsShown", true);
  const [sidebarShown, setSidebarShown] = useState<boolean>(false);
  const [buttonsShown, setButtonsShown] = useState<boolean>(true);
  const toggleActive = (navItem: number) => {
    setActiveLink(navItem);
  };

  const navItems = [14, 13, 12, 11];

  useEffect(() => {
    let timer: number;
    if (activeLink) {
      timer = setTimeout(() => {
        setButtonsShown(false);
        setSidebarShown(true);
      }, 500);
      timer = setTimeout(() => {}, 1000);
    }

    return () => clearTimeout(timer);
  }, [activeLink]);

  return (
    <div className={`grow flex ${sidebarShown ? "flex-col md:flex-row" : "flex-col"}`}>
      <ASTitlePopup />
      <div
        className={`allstars flex gap-2 bg-white text-black dark:bg-black dark:text-white flex-col items-center justify-center grow pt-20 transition duration-500 ${
          buttonsShown ? "" : "hidden"
        } ${activeLink ? "opacity-0" : ""}`}>
        <div className="title text-6xl">
          <h2>All Stars: Select a Season</h2>
        </div>
        {/* Navigation */}
        <div className={`ASNav flex flex-col items-center gap-4 px-4 justify-center grow `}>
          <div className="seasonSelect flex-col md:grid grid-cols-2 gap-8">
            <button
              onClick={() => toggleActive(14)}
              className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}>
              Season 14
            </button>
            <button
              onClick={() => toggleActive(13)}
              className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}>
              Season 13
            </button>
            <button
              onClick={() => toggleActive(12)}
              className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}>
              Season 12
            </button>
            <button
              onClick={() => toggleActive(11)}
              className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}>
              Season 11
            </button>
          </div>
        </div>
      </div>
      {sidebarShown && (
        <>
          <ASSidebar activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
          <ASContent activeSeason={activeLink ? activeLink : 14} />
        </>
      )}
    </div>
  );
}

export default ASMain;
