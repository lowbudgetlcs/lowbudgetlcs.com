import Logo from "./Logo";
import { NavLink } from "react-router-dom";

import { useState } from "react";

interface FullNavProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FullNav({ isOpen, setIsOpen }: FullNavProps) {
  const toggleTop = () => {
    window.scrollTo(0, 0);
  };

  const close = () => {
    setIsOpen(false);
  };

  const closeToTop = () => {
    close();
    toggleTop();
  };

  return (
    <div
      className={`fullNav fixed w-10/12 md:w-3/5 h-screen font-serif -z-10 ${
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
        <li className="text-left animate-slide-in-300 opacity-0">
          <NavLink
            onClick={closeToTop}
            className="hover:text-orange transition duration-300"
            to="/"
          >
            <div className="navBox pl-14 py-10">Home</div>
          </NavLink>
        </li>
        <li className="text-left animate-slide-in-400 opacity-0">
          <NavLink
            onClick={close}
            className="hover:text-orange transition duration-300"
            to="/about"
          >
            <div className="navBox pl-14 py-10">Leagues</div>
          </NavLink>
        </li>
        <li className="text-left animate-slide-in-500 opacity-0">
          <NavLink
            className="hover:text-orange transition duration-300"
            to="https://docs.google.com/document/d/1poO5lo9Mh8k85Vhh3UNCFJNxvSfsWGTkN7v-EdT9Rp8/edit?usp=sharing"
            target="_blank"
          >
            <div className="navBox pl-14 py-10">Rules</div>
          </NavLink>
        </li>
        <li className="animate-slide-in-600 opacity-0">
          <NavLink
            onClick={close}
            className="hover:text-orange transition duration-300"
            to="/rosters"
          >
            <div className="navBox pl-14 py-10">Rosters</div>
          </NavLink>
        </li>
        <li className="animate-slide-in-700 opacity-0">
          <NavLink className="hover:text-orange transition duration-300" to="#">
            <div className="navBox pl-14 py-10">
              Stats <br /> <span className="text-lg">(Coming Soon)</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  function toggleNavbar() {
    setIsOpen(!isOpen);
  }

  document.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      setIsTop(false);
    } else {
      setIsTop(true);
    }
  });

  return (
    <header
      className={`fixed top-0 z-[20] transition duration-500 mx-auto w-full h-20 ${
        isTop ? "" : "bg-light-gray"
      }`}
    >
      <div className="flex items-center justify-between px-4 text-lg h-full">
        <div
          onClick={toggleNavbar}
          className="burger relative h-6 w-6 flex flex-col gap-1 hover:cursor-pointer"
        >
          <div
            className={`absolute ${
              isOpen ? "top-2 rotate-45" : "top-0"
            } transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
          ></div>
          <div
            className={`absolute ${
              isOpen ? "opacity-0" : "opacity-100"
            } transition-all duration-300  top-2 px-3 py-0.5 rounded-xl bg-white`}
          ></div>
          <div
            className={`absolute ${
              isOpen ? "top-2 -rotate-45" : "top-4"
            } transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
          ></div>
        </div>
        <Logo />
      </div>
      <FullNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

export default Navbar;
