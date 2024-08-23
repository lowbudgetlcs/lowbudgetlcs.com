import { NavLink } from "react-router-dom";
import logo from "../assets/Transparent_LBLCS_Logo_White_Text.png";
const toggleTop = () => {
  window.scrollTo(0, 0);
}
function Logo() {
  return (
    <div className="logo scale-125">
      <NavLink onClick={toggleTop} to={"/"}>
        <img
          src={logo}
          alt="logo"
          width={116}
          height={66}
          className="dark:bg-transparent bg-black/50 rounded-lg"
        />
      </NavLink>
    </div>
  );
}

export default Logo;
