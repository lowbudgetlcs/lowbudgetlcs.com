import { NavLink } from "react-router-dom";
import discordLogo from "../assets/discordLogo.svg"
import twitchLogo from "../assets/twitchLogo.svg"

function Nav() {
  return (
    <nav>
      <ul className="flex gap-4 justify-center items-center">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/https://discord.com/invite/XfsEEq4aPC">Leagues</NavLink>
        </li>
        <li>
          <NavLink to="/https://discord.com/invite/XfsEEq4aPC">Rules</NavLink>
        </li>
        <li>
          <NavLink to="https://www.twitch.tv/lowbudgetlcs"><img className="hover: transition h-8" src={twitchLogo}></img></NavLink>
        </li>
        <li>
          <NavLink to="/https://discord.com/invite/XfsEEq4aPC"><img className="transition h-8" src={discordLogo}></img></NavLink>
        </li>
      </ul>
    </nav>
    
  );
}

export default Nav;