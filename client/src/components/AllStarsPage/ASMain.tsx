import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function ASMain() {
  const [activeLink, setActiveLink] = useState<string>();

  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  return (
    <div className="allstars gap-2 bg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="popup absolute w-screen h-screen bg-black/60 flex flex-col md:flex-row justify-around items-center p-12 gap-12">
        <h1 className="text-6xl text-nowrap text-center">All Stars</h1>
        <div className="flex flex-col items-center md:w-1/2">
          <p className="summary text-lg md:text-xl">
            After every LBLCS season, each team votes for players on who is the
            best in their role. We then take those results and smash all these
            stars into teams of their own and make them compete for charity!
          </p>
          <p className="text-lg md:text-xl pt-4 pb-4">
            All proceeds gained from the stream go to the charity announced in
            discord. Please donate to help the cause!
          </p>
          <p className="text-white/60 text-lg md:text-xl">
            The 1st all-star teams play in the event. If people are not
            available, 2nd and 3rd team members are asked to fill in.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ASMain;
