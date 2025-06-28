import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Button from "../Button";

function ASMain() {
  const [activeLink, setActiveLink] = useState<string>();
  const [popupOpen, setPopupOpen] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };

  useEffect(() => {
    let timer: number;
    if (isClosing) {
      timer = setTimeout(() => {
        setPopupOpen(false);
        setIsClosing(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [isClosing]);

  return (
    <div className="allstars gap-2 bg-white text-black dark:bg-black dark:text-white font-serif flex-col items-center justify-center">
      {/* Title Popup */}
      <div
        className={`popup absolute w-screen h-screen bg-black/80 flex flex-col md:flex-row justify-around items-center p-2 sm:p-12 md:gap-12 transition duration-500 ${
          popupOpen ? "" : "hidden"
        } ${isClosing ? "opacity-0" : ""}`}
      >
        <h1 className="text-6xl lg:text-7xl text-nowrap text-center font-bold">
          All Stars
        </h1>
        <div className="flex flex-col items-center md:w-1/2 xl:w-1/3">
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
          <button
            onClick={() => setIsClosing(true)}
            className="py-4 px-8 m-4 bg-blue rounded-md hover:bg-orange transition duration-300 font-bold text-lg"
          >
            Take a look
          </button>
        </div>
      </div>
      {/* Navigation */}
      <div className="ASNav flex flex-col items-center gap-4 p-4">
        <div className="title text-6xl">
          <h2>Select a Season</h2>
        </div>
        <div className="seasonSelect flex-col md:grid grid-cols-2 gap-8">
          <button
            className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}
          >
            Season 14
          </button>
                    <button
            className={`text-2xl font-bold bg-gray px-14 py-10 rounded-md hover:bg-orange transition duration-300`}
          >
            Season 13
          </button>
        </div>
      </div>
    </div>
  );
}

export default ASMain;
