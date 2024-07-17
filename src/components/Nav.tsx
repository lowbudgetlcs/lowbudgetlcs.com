import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul className="flex gap-4 justify-center">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/https://discord.com/invite/XfsEEq4aPC">Discord</NavLink>
        </li>
      </ul>
    </nav>
    
  );
}

export default Nav;