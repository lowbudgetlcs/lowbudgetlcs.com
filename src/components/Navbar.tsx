import Logo from "./Logo";
import Nav from "./Nav";

function Navbar() {
  return (
      <header className=" bg-gray sticky top-0 z-[20] mx-auto flex w-full items-center justify-between p-4">
        <Logo />
        <Nav />
      </header>
  );
}

export default Navbar;
