interface NavListProps {
  activeLink: number | undefined;
  toggleActive: (navItem: number) => void;
  navItems: Array<number>;
}

const ASSidebar: React.FC<NavListProps> = ({ activeLink, toggleActive, navItems }) => {
  let currentAnimationNum = 200;
  return (
    <div className="sidebar text-white pt-20 bg-light-gray transition duration-500 opacity-0 animate-slide-in-right text-nowrap">
      <ul className="flex flex-col justify-center px-8 gap-8 text-2xl font-bold">
        {navItems.map((navItem) => {
          currentAnimationNum = currentAnimationNum + 100;
          const animationTiming = `animate-slide-in-${currentAnimationNum}`;
          return (
            <li
              key={navItem}
              onClick={() => toggleActive(navItem)}
              className={`hover:cursor-pointer hover:text-orange transition duration-300 opacity-0 ${animationTiming}`}>
              Season {navItem}
              <span
                className={`line absolute ${
                  activeLink === navItem ? "w-full" : "w-0"
                } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ASSidebar;
