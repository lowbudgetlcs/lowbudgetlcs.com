import { NavLink } from "react-router-dom";
import logo from "../assets/Transparent_LBLCS_Logo_White_Text.png";
function Logo() {
  return (
    <div className="logo scale-125">
      <NavLink to={"/"}>
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
