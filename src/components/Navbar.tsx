import Logo from "./Logo";
import Nav from "./Nav";
import NavSocials from "./NavSocials";

import { useState } from "react";

function Navbar() {
  const [isHidden, setIsHidden] = useState(true);

  function toggleHidden() {
    setIsHidden(!isHidden)
  }

  return (
    <header className="sticky top-0 z-[20] mx-auto flex w-full items-center justify-between px-4 text-lg h-20">
      <Logo />
      <div className={isHidden ? 'hidden' : ''}>
        <Nav />
        <NavSocials />
      </div>

      <div
        onClick={toggleHidden}
        className="burger flex flex-col gap-1 hover:cursor-pointer"
      >
        <line className="px-3 py-0.5 rounded-xl bg-white"></line>
        <line className="px-3 py-0.5 rounded-xl bg-white"></line>
        <line className="px-3 py-0.5 rounded-xl bg-white"></line>
      </div>
    </header>
  );
}

export default Navbar;
