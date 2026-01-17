//? To use: Must have these lines commented below in every component
//? Required variables for Nav List
//   const [activeLink, setActiveLink] = useState<string>("[Default Link]");
//   const toggleActive = (navItem: string) => {
//     setActiveLink(navItem);
//   };
//   const navItems = [ [All Nav Items (ex: 'item1', 'item2', 'item3')] ]

import { useEffect, useRef, useState } from "react";

interface NavListProps {
  activeLink: string;
  toggleActive: (navItem: string) => void;
  navItems: Array<string>;
  grow?: boolean;
}

const NavList: React.FC<NavListProps> = ({ activeLink, toggleActive, navItems, grow }) => {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

  useEffect(() => {
    const activeItem = itemRefs.current.get(activeLink);
    if (activeItem) {
      setUnderlineStyle({
        left: activeItem.offsetLeft,
        width: activeItem.offsetWidth,
      });
    }
  }, [activeLink, navItems]);

  return (
    <div className="navList flex justify-center w-full">
      <ul className={`relative flex flex-wrap gap-4 text-lg font-semibold px-6 py-2 rounded-md bg-bg-light light:bg-bg-dark border-2 border-border ${grow ? 'grow justify-around' : 'justify-center'}`}>
        <span
          className="absolute bottom-1 h-1 bg-primary-light transition-all duration-300 rounded-full"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
        />
        {navItems.map((navItem) => (
          <li
            ref={(el) => { itemRefs.current.set(navItem, el); }}
            key={navItem}
            onClick={() => toggleActive(navItem)}
            className={`relative transition duration-300 cursor-pointer z-10 ${
              activeLink === navItem 
                ? "text-primary-light font-bold" 
                : "text-text-primary/60 hover:text-text-primary"
            }`}
          >
            {navItem}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavList;
