//? To use: Must have these lines commented below in every component
//? Required variables for Nav List
//   const [activeLink, setActiveLink] = useState<string>("[Default Link]");
//   const toggleActive = (navItem: string) => {
//     setActiveLink(navItem);
//   };
//   const navItems = [ [All Nav Items (ex: 'item1', 'item2', 'item3')] ]

interface NavListProps {
  activeLink: string;
  toggleActive: (navItem: string) => void;
  navItems: Array<string>;
  grow?: boolean;
}

const NavList: React.FC<NavListProps> = ({ activeLink, toggleActive, navItems, grow }) => {
  return (
    <div className="navList">
      <ul className={`relative flex flex-wrap gap-4 text-sm sm:text-base md:text-2xl font-semibold p-4 ${grow ? 'grow justify-around' : 'justify-center'}`}>
        {navItems.map((navItem) => (
          <li
            key={navItem}
            onClick={() => toggleActive(navItem)}
            className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
          >
            {navItem}
            <span
              className={`line absolute ${
                activeLink === navItem ? "w-full" : "w-0"
              } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
            ></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavList;
