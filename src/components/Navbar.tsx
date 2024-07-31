import Logo from "./Logo";
import { NavLink } from "react-router-dom";

import { useState } from "react";

interface FullNavProps {
  isOpen: boolean;
}

function FullNav({ isOpen }: FullNavProps) {
  return (
    <div
      className={
        isOpen
          ? "fullnav fixed w-2/5 h-screen font-serif -z-10 opacity-100 translate-x-0 bg-gradient-to-r from-black left-0 top-0 duration-500 ease-in-out flex flex-col"
          : "fullnav fixed w-2/5 h-screen font-serif -z-10 opacity-0 -translate-x-full bg-gradient-to-r from-black left-0 top-0 duration-500 ease-in-out"
      }
    >
      <div className="w-full h-20"></div>
      <ul
        className={
          isOpen
            ? "text-white font-semibold text-2xl flex flex-col gap-0 justify-around"
            : "hidden"
        }
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
          <NavLink className="hover:text-orange transition" to="/rules">
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
        className="burger flex flex-col gap-1 hover:cursor-pointer"
      >
        <div className="px-3 py-0.5 rounded-xl bg-white"></div>
        <div className="px-3 py-0.5 rounded-xl bg-white"></div>
        <div className="px-3 py-0.5 rounded-xl bg-white"></div>
      </div>
      <FullNav isOpen={isOpen} />
      <Logo />
    </header>
  );
}

export default Navbar;
