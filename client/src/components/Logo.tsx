import { NavLink } from "react-router-dom";
import logo from "../assets/lblcsLogo.svg";

function Logo() {
  const toggleTop = () => {
    window.scrollTo(0, 0);
  }
  return (
    <div className="logo overflow-hidden">
      <NavLink onClick={toggleTop} to={"/"}>
        <img
          src={logo}
          alt="logo"
          width={140}
          height={140}
          className="dark:bg-transparent bg-black/50 rounded-lg"
        />
      </NavLink>
    </div>
  );
}

export default Logo;
