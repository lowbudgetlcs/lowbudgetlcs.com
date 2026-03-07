import { NavLink } from "react-router";

interface NavListProps {
  activeLink: string | number | undefined;
  toggleActive: (navItem: string | number) => void;
  navItems: Array<string | number>;
  prefix?: string;
  param: string;
  replaceHistory?: boolean;
}

const NavSideBar: React.FC<NavListProps> = ({ activeLink, toggleActive, navItems, prefix, param, replaceHistory = false }) => {
  let currentAnimationNum = 200;
  return (
    <div className="sidebar text-text-secondary pt-20 bg-bg transition duration-500 opacity-0 animate-slide-in-right text-nowrap border-r border-border">
      <ul className="flex flex-row md:flex-col md:justify-center md:px-8 gap-8 md:text-2xl overflow-x-scroll overflow-y-hidden md:overflow-y-scroll font-bold no-scrollbar p-2">
        {navItems.map((navItem) => {
          currentAnimationNum = currentAnimationNum + 100;
          const animationTiming = `animate-slide-in-${currentAnimationNum}`;
          return (
            <NavLink
              to={{search: `?${param}=${navItem}`}}
              replace={replaceHistory}
              key={navItem}
              onClick={() => toggleActive(navItem)}
              className={`relative inline-flex w-fit pb-1 hover:cursor-pointer hover:text-orange transition duration-300 opacity-0 ${animationTiming}`}>
              {prefix} {navItem}
              <span
                className={`line absolute ${
                  activeLink === navItem ? "w-full" : "w-0"
                } transition-all duration-200 border-b-4 border-orange rounded-md bottom-0 left-0`}></span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};

export default NavSideBar;
