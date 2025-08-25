import { NavLink } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSettingsContext } from "../providers/SettingsProvider";
import MainLink from "../../MainLink";

interface FullNavProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FullNav({ isOpen, setIsOpen }: FullNavProps) {
  const { setSettingsVisible } = useSettingsContext();
  const toggleTop = () => {
    window.scrollTo(0, 0);
  };

  function toggleNavbar() {
    setIsOpen(false);
  }
  const close = () => {
    setIsOpen(false);
  };

  const closeToTop = () => {
    close();
    toggleTop();
  };

  const openSettings = () => {
    close();
    setSettingsVisible(true);
  };

  return (
    <div
      onClick={toggleNavbar}
      className={`fullNav fixed w-10/12 md:w-3/5 h-screen font-serif ${
        isOpen ? "opacity-100" : "opacity-0"
      } ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-gradient-to-r from-black left-0 top-0 transition-all duration-500 ease-in-out flex flex-col
      `}
    >
      <div className="w-full h-20"></div>
      <ul
        className={` ${
          isOpen ? "" : "hidden"
        } text-white font-semibold text-3xl w-fit transition-all duration-100 flex flex-col gap-0 justify-around`}
      >
        <li className="animate-slide-in-300 opacity-0">
          <NavLink
            onClick={closeToTop}
            className="hover:text-orange transition duration-300"
            to="/"
          >
            <div className="navBox pl-14 py-10">New Draft</div>
          </NavLink>
        </li>
        <li className="text-left animate-slide-in-400 opacity-0">
          <MainLink
            onClick={closeToTop}
            className="hover:text-orange transition duration-300"
            to="/"
          >
            <div className="navBox pl-14 py-10">Home</div>
          </MainLink>
        </li>
        <li className="text-left animate-slide-in-500 opacity-0">
          <div
            onClick={openSettings}
            className="hover:text-orange transition duration-300 cursor-pointer"
          >
            <div className="flex flex-col gap-2 py-10">
              <div className="navBox pl-14 ">Settings</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

function DraftNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  function toggleNavbar() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY <= 20);
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-[999] transition duration-500 mx-auto h-16 ${
        isTop ? "" : "bg-light-gray"
      }`}
    >
      <div className="flex items-center justify-between px-6 text-lg h-full overflow-hidden ">
        <div
          onClick={toggleNavbar}
          className="burger relative h-6 w-6 flex flex-col gap-1 hover:cursor-pointer z-10 group"
        >
          <div
            className={`absolute ${
              isOpen ? "top-2 rotate-45 bg-white" : "top-0 bg-white/60"
            } transition-all duration-500 px-3 py-0.5 rounded-xl group-hover:bg-white`}
          ></div>
          <div
            className={`absolute ${
              isOpen ? "opacity-0" : "opacity-100"
            } transition-all duration-500  top-2 px-3 py-0.5 rounded-xl bg-white/60 group-hover:bg-white`}
          ></div>
          <div
            className={`absolute ${
              isOpen ? "top-2 -rotate-45 bg-white" : "top-4  bg-white/60"
            } transition-all duration-500 px-3 py-0.5 rounded-xl group-hover:bg-white`}
          ></div>
        </div>
      </div>
      <FullNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

export default DraftNavbar;
