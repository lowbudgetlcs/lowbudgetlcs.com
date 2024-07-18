import { NavLink } from "react-router-dom";

function NavSocials() {
  return (
    <ul className="flex gap-4 justify-center items-center">
      <li>
        <NavLink to="/https://discord.com/invite/XfsEEq4aPC">
          <i className="hover:text-orange transition bi bi-instagram text-3xl"></i>
        </NavLink>
      </li>
      <li>
        <NavLink to="/https://discord.com/invite/XfsEEq4aPC">
          <i className="hover:text-orange transition bi bi-discord text-3xl"></i>
        </NavLink>
      </li>
      <li>
        <NavLink to="https://www.twitch.tv/lowbudgetlcs">
          <i className=" hover:text-orange transition bi bi-twitch block text-3xl"></i>
        </NavLink>
      </li>
    </ul>
  );
}

export default NavSocials;
