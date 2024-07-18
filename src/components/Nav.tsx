import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Nav() {
  return (
    <nav>
      <ul className="flex gap-4 justify-center items-center">
        <li>
          <NavLink className="hover:text-orange transition" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="hover:text-orange transition" to="/about">
            About
          </NavLink>
        </li>
        <li>
          <NavLink className="hover:text-orange transition" to="/rules">
            Rules
          </NavLink>
        </li>
        <li>
          <NavLink className="hover:text-orange transition" to="/stats">
            Rosters
          </NavLink>
        </li>
        <li>
          <NavLink className="hover:text-orange transition" to="/stats">
            Stats
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
