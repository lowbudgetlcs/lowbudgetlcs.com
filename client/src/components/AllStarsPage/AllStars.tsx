import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function AllStars() {
  const [activeLink, setActiveLink] = useState<String>();

  const toggleActive = (navItem: String) => {
    setActiveLink(navItem);
  };
  return (
    <div className="allstars bg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Stars</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-8 md:px-16 w-full md:w-2/3 pt-8  ">
          After every LBLCS season, each team votes for players on who is the
          best in their role. We then take those results and smash all these
          stars into teams of their own and make them compete for charity!
        </p>
        <p className="text-lg md:text-xl pt-4 pb-4 px-8 md:px-16 w-full md:w-2/3">
          All proceeds gained from the stream go to the charity announced in
          discord. Please donate to help the cause!
        </p>
        <p className="text-white/60 text-lg md:text-xl px-8 md:px-16 w-full md:w-2/3">
          The 1st all-star teams play in the event. If people are not available,
          2nd and 3rd team members are asked to fill in.
        </p>
        <p className="text-white/60 text-lg md:text-xl pt-4 px-8 md:px-16 w-full md:w-2/3">
          Graphics are created by: <span className="italic">b3ar_</span>, <span className="italic">Zoodiac</span>, and <span className="italic">.qiiqo</span> !

        </p>
        <p className="text-white/60 text-center text-base px-8 pt-16 md:px-16 w-full md:w-2/3">
          Click on the division you want to view below!
        </p>
      </div>
      <div className="navList">
        <ul className="relative flex gap-4 text-sm sm:text-base md:text-2xl font-semibold justify-center p-4">
          <Link to={"economy"}>
            <li
              onClick={() => toggleActive("Economy")}
              className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
            >
              Economy
              <span
                className={`line absolute ${
                  activeLink === "Economy" ? "w-full" : "w-0"
                } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
              ></span>
            </li>
          </Link>
          <Link to={"commercial"}>
            <li
              onClick={() => toggleActive("Commercial")}
              className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
            >
              Commercial
              <span
                className={`line absolute ${
                  activeLink === "Commercial" ? "w-full" : "w-0"
                } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
              ></span>
            </li>
          </Link>
          <Link to={"financial"}>
            <li
              onClick={() => toggleActive("Financial")}
              className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
            >
              Financial
              <span
                className={`line absolute ${
                  activeLink === "Financial" ? "w-full" : "w-0"
                } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
              ></span>
            </li>
          </Link>
          <Link to={"executive"}>
            <li
              onClick={() => toggleActive("Executive")}
              className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
            >
              Executive
              <span
                className={`line absolute ${
                  activeLink === "Executive" ? "w-full" : "w-0"
                } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
              ></span>
            </li>
          </Link>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export default AllStars;
