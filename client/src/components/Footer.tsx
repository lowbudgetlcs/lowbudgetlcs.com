import { NavLink } from "react-router-dom";
import DraftLink from "./DraftLink";
import MainLink from "./MainLink";

function Footer() {
  return (
    <div className="footer w-full h-auto flex flex-col justify-around items-center text-black dark:text-white bg-light-blue dark:bg-black border-t-2 border-orange dark:border-gray">
      <div className="footerText pt-4">
        <ul className="font-semibold text-xl flex flex-wrap gap-4 justify-around px-2">
          <li className="">
            <MainLink className="hover:text-orange transition" to="/">
              <div className="">Home</div>
            </MainLink>
          </li>
          <li className="">
            <MainLink className="hover:text-orange transition" to="/about">
              <div className="">About</div>
            </MainLink>
          </li>
          <li className="">
            <NavLink
              className="hover:text-orange transition"
              target="_blank"
              to="https://docs.google.com/document/d/16uYlGmADc1x1v3MXQhRgUqICNabnjxqiirJmw7W-tQI/edit?usp=sharing">
              <div className="">Rules</div>
            </NavLink>
          </li>
          <li className="">
            <MainLink className="hover:text-orange transition" to="/rosters">
              <div className="">Rosters</div>
            </MainLink>
          </li>
          <li className="">
            <MainLink className="hover:text-orange transition" to="/allstars">
              <div className="">All Stars</div>
            </MainLink>
          </li>
          <li className="">
            <DraftLink className="hover:text-orange transition" to="/">
              <div className="">Draft Tool</div>
            </DraftLink>
          </li>
          {/* <li className="">
            <MainLink className="hover:text-orange transition" to="/stats">
              <div className="">Stats</div>
            </MainLink>
          </li> */}
        </ul>
      </div>

      <ul className="flex gap-8 p-2">
        <li className="w-8 h-auto">
          <NavLink
            aria-label="Instagram Profile"
            target="_blank"
            to="https://www.instagram.com/lowbudgetlcs">
            <i className="hover:text-orange transition duration-300 bi bi-instagram text-4xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink
            aria-label="Discord Server"
            target="_blank"
            to="https://discord.com/invite/XfsEEq4aPC">
            <i className="hover:text-orange transition duration-300 bi bi-discord text-4xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink
            aria-label="Twitch Channel"
            target="_blank"
            to="https://www.twitch.tv/lowbudgetlcs">
            <i className="hover:text-orange transition duration-300 bi bi-twitch text-4xl"></i>
          </NavLink>
        </li>
        <li className="w-8 h-auto">
          <NavLink
            aria-label="Youtube Channel"
            target="_blank"
            to="https://www.youtube.com/@lowbudgetlcs9513">
            <i className="hover:text-orange transition duration-300 bi bi-youtube text-4xl"></i>
          </NavLink>
        </li>
      </ul>
      <div className="riotDisclaimer text-xs md:text-center p-2 text-white/70">
        <p className="mb-2">
          This competition is not affiliated with or sponsored by Riot Games, Inc. or League of
          Legends Esports.
        </p>
        <p className="mb-2">
          LowBudgetLCS isn't endorsed by Riot Games and doesn't reflect the views or opinions of
          Riot Games or anyone officially involved in producing or managing Riot Games properties.
          Riot Games, and all associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </p>
      </div>
    </div>
  );
}

export default Footer;
