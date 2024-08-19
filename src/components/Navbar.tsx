import Logo from "./Logo";
import { NavLink } from "react-router-dom";

import { useState } from "react";

interface FullNavProps {
  isOpen: boolean;
}

function FullNav({ isOpen }: FullNavProps) {
  return (
    <div
      className={`fullNav fixed w-2/5 h-screen font-serif -z-10 ${
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
        } text-white font-semibold text-3xl transition-all flex flex-col gap-0 justify-around`}
      >
        <li className="text-left animate-slide-in-300 opacity-0">
          <NavLink className="hover:text-orange transition" to="/">
            <div className="navBox pl-14 py-10">Home</div>
          </NavLink>
        </li>
        <li className="text-left animate-slide-in-400 opacity-0">
          <NavLink className="hover:text-orange transition" to="/about">
            <div className="navBox pl-14 py-10">About</div>
          </NavLink>
        </li>
        <li className="text-left animate-slide-in-500 opacity-0">
          <NavLink
            className="hover:text-orange transition"
            to="https://docs.google.com/document/d/1poO5lo9Mh8k85Vhh3UNCFJNxvSfsWGTkN7v-EdT9Rp8/edit?usp=sharing"
          >
            <div className="navBox pl-14 py-10">Rules</div>
          </NavLink>
        </li>
        <li className="animate-slide-in-600 opacity-0">
          <NavLink className="hover:text-orange transition" to="/stats">
            <div className="navBox pl-14 py-10">Rosters</div>
          </NavLink>
        </li>
        <li className="animate-slide-in-700 opacity-0">
          <NavLink className="hover:text-orange transition" to="/stats">
            <div className="navBox pl-14 py-10">Stats</div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleNavbar() {
    setIsOpen(!isOpen);
  }

  return (
    <header className="fixed top-0 z-[20] mx-auto flex w-full items-center justify-between px-4 text-lg h-20">
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
      <FullNav isOpen={isOpen} />
      <Logo />
    </header>
  );
}

export default Navbar;
