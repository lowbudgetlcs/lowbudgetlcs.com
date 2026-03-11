import { NavLink } from "react-router-dom";
import DraftLink from "../components/DraftLink";
import MainLink from "../components/MainLink";

function Footer() {
  return (
    <div className="footer w-full h-auto flex flex-col justify-around items-center text-text-primary bg-bg-dark border-t-2 border-border">
      <div className="footerText pt-2">
        <ul className="font-semibold text-lg flex flex-wrap gap-4 justify-around px-2">
          <li className="">
            <MainLink className="hover:text-primary-light transition" to="/">
              <div className="">Home</div>
            </MainLink>
          </li>
          <li className="">
            <MainLink className="hover:text-primary-light transition" to="/about">
              <div className="">About</div>
            </MainLink>
          </li>
          <li className="">
            <NavLink
              className="hover:text-primary-light transition"
              target="_blank"
              to="https://docs.google.com/document/d/1gwZpciwnRG8nao42zNZCKxwXf7fgdFXQm-tDAaQ6T1I/edit?usp=sharing">
              <div className="">Rules</div>
            </NavLink>
          </li>
          <li className="">
            <NavLink className="hover:text-primary-light transition" to="/stats">
              <div className="">Stats</div>
            </NavLink>
          </li>
          <li className="">
            <MainLink className="hover:text-primary-light transition" to="/rosters">
              <div className="">Rosters</div>
            </MainLink>
          </li>
          {/* <li className="">
            <MainLink className="hover:text-primary-light transition" to="/allstars">
              <div className="">All Stars</div>
            </MainLink>
          </li> */}
          <li className="">
            <DraftLink className="hover:text-primary-light transition" to="/">
              <div className="">Draft Tool</div>
            </DraftLink>
          </li>
        </ul>
      </div>

      <ul className="flex gap-8 py-1">
        <li className="w-6 h-auto">
          <NavLink aria-label="Instagram Profile" target="_blank" to="https://www.instagram.com/lowbudgetlcs">
            <i className="hover:text-primary-light transition duration-300 bi bi-instagram text-3xl"></i>
          </NavLink>
        </li>
        <li className="w-6 h-auto">
          <NavLink aria-label="Discord Server" target="_blank" to="https://discord.com/invite/XfsEEq4aPC">
            <i className="hover:text-primary-light transition duration-300 bi bi-discord text-3xl"></i>
          </NavLink>
        </li>
        <li className="w-6 h-auto">
          <NavLink aria-label="Twitch Channel" target="_blank" to="https://www.twitch.tv/lowbudgetlcs">
            <i className="hover:text-primary-light transition duration-300 bi bi-twitch text-3xl"></i>
          </NavLink>
        </li>
        <li className="w-6 h-auto">
          <NavLink aria-label="Youtube Channel" target="_blank" to="https://www.youtube.com/@lowbudgetlcs9513">
            <i className="hover:text-primary-light transition duration-300 bi bi-youtube text-3xl"></i>
          </NavLink>
        </li>
      </ul>
      <div className="riotDisclaimer text-xs md:text-center py-1 px-2 text-text-secondary">
        <p className="mb-2 md:mb-0">This competition is not affiliated with or sponsored by Riot Games, Inc. or League of Legends Esports.</p>
        <p className="">
          LowBudgetLCS isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing
          or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
        </p>
      </div>
    </div>
  );
}

export default Footer;
