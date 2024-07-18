import Logo from "./Logo";
import Nav from "./Nav";
import NavSocials from "./NavSocials";

function Navbar() {
  return (
    <header className="bg-light-blue sticky top-0 z-[20] mx-auto flex w-full items-center justify-between px-4 text-lg h-20">
      <Logo />
      <Nav />
      <NavSocials />
    </header>
  );
}

export default Navbar;
