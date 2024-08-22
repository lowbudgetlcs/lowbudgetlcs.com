import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="footer h-auto flex flex-col justify-around items-center text-black dark:text-white bg-light-blue dark:bg-black border-t-2 border-orange dark:border-gray">
      <div className="footerText pt-4">
        <ul className="font-semibold text-xl flex flex-wrap gap-4 justify-around">
          <li className="">
            <NavLink className="hover:text-orange transition" to="/">
              <div className="">Home</div>
            </NavLink>
          </li>
          <li className="">
            <NavLink className="hover:text-orange transition" to="/about">
              <div className="">About</div>
            </NavLink>
          </li>
          <li className="">
            <NavLink
              className="hover:text-orange transition"
              target="_blank"
              to="https://docs.google.com/document/d/1poO5lo9Mh8k85Vhh3UNCFJNxvSfsWGTkN7v-EdT9Rp8/edit?usp=sharing"
            >
              <div className="">Rules</div>
            </NavLink>
          </li>
          {/* <li className="">
            <NavLink className="hover:text-orange transition" to="/stats">
              <div className="">Rosters</div>
            </NavLink>
          </li>
          <li className="">
            <NavLink className="hover:text-orange transition" to="/stats">
              <div className="">Stats</div>
            </NavLink>
          </li> */}
        </ul>
      </div>

      <ul className="flex gap-8 p-4">
        <li className="w-8 h-auto">
          <NavLink target="_blank" to="https://www.instagram.com/lowbudgetlcs">
            <i className="hover:text-orange transition duration-300 bi bi-instagram text-4xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink target="_blank" to="https://discord.com/invite/XfsEEq4aPC">
            <i className="hover:text-orange transition duration-300 bi bi-discord text-4xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink target="_blank" to="https://www.twitch.tv/lowbudgetlcs">
            <i className="hover:text-orange transition duration-300 bi bi-twitch text-4xl"></i>
          </NavLink>
        </li>
      </ul>
      <div className="riotDisclaimer text-xs p-2 text-white/70">
        <p>LowBudgetLCS isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
      </div>
    </div>
  );
}

export default Footer;
