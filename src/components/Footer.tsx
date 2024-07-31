import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="footer ">
      <ul className="flex h-20 w-full gap-8 text-white bg-black border-t-2 border-gray">
        <li className="w-8 h-auto">
          <NavLink to="/https://discord.com/invite/XfsEEq4aPC">
            <i className="hover:text-orange transition bi bi-instagram text-3xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink to="https://discord.com/invite/XfsEEq4aPC">
            <i className="hover:text-orange transition bi bi-discord text-3xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink to="https://www.twitch.tv/lowbudgetlcs">
            <i className="hover:text-orange bi bi-twitch text-3xl"></i>
          </NavLink>
        </li>
        

      </ul>
      <i className="bi-alarm"></i>
    </div>
  );
}

export default Footer;
