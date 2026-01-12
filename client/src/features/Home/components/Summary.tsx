import Button from "../../../components/Button";
import AltButton from "../../../components/AltButton";
import { Link, NavLink } from "react-router-dom";
import SubdomainLink from "../../../components/SubdomainLink";
import { FaDiscord, FaInstagram, FaTwitch, FaYoutube } from "react-icons/fa";
import { useState } from "react";

function Summary() {
  const [slogan] = useState(() => {
    const slogans: { top: string; bottom: string }[] = [
      { top: "The League Where Your Mom", bottom: "Can Be Your Coach." },
      { top: "Competitive Enough to Crash Out.", bottom: "Casual Enough to Have Fun." },
      { top: "Find Your Team, Lose Your Lane,", bottom: "Keep Your Friends." },
      { top: "Where The Production Value", bottom: "Is as Low as Our Win Rates." },
    ];
    return slogans[Math.floor(Math.random() * slogans.length)];
  });
  return (
    <div className="summary absolute top-0 left-0 w-full h-full flex justify-center md:grid md:grid-cols-2 gap-4 place-items-center items-center bg-linear-90 from-black to-transparent">
      <div className="titleContent flex flex-col gap-4 max-w-xl rounded-md p-6">
        <h1 className="title text-3xl text-white font-bold text-center opacity-0 animate-slide-in-300">
          {slogan.top}
          <br />
          {slogan.bottom}
        </h1>
        <div className="px-1.5">
          <p className="text-wrap text-gray-300 text-lg opacity-0 animate-slide-in-600">
            We are a free, and friendly amateur rec league that mirrors what would happen if Riot Games
            suffered a catastrophic financial disaster
          </p>
        </div>

        <div className="flex gap-4 justify-center opacity-0 animate-slide-in-900">
          <NavLink to="https://discord.com/invite/XfsEEq4aPC" target="_blank">
          <Button className="discord">Join The Discord</Button>
          </NavLink>
          <Link to="/about">
            <AltButton>About Us</AltButton>
          </Link>
        </div>
      </div>
      <div className="w-full h-full md:flex justify-end items-center hidden">
        <div className="quickNav flex flex-col p-8 ">
          <SubdomainLink subdomain="draft" to="/" className="w-full h-full">
            <Button className="mb-4 w-full h-full">Draft Tool</Button>
          </SubdomainLink>
          <Button className="mb-4">Rosters</Button>
          <Button className="mb-4">Stats</Button>
          <div className="socials grid grid-cols-2 items-center place-items-center gap-2">
            <NavLink
              aria-label="Instagram Profile"
              target="_blank"
              rel="noopener noreferrer"
              className={``}
              to="https://www.instagram.com/lowbudgetlcs">
              <Button className="text-2xl">
                <FaInstagram />
              </Button>
            </NavLink>
            <NavLink
                aria-label="Discord Server"
                target="_blank"
              to="https://discord.com/invite/XfsEEq4aPC"
              rel="noopener"
              className={``}>
              <Button className="text-2xl">
                <FaDiscord />
              </Button>
            </NavLink>
            <NavLink
              aria-label="Twitch Channel"
              target="_blank"
              to="https://www.twitch.tv/lowbudgetlcs"
              rel="noopener"
              className={``}>
              <Button className="text-2xl">
                <FaTwitch />
              </Button>
            </NavLink>
            <NavLink
              aria-label="Youtube Channel"
              target="_blank"
              to="https://www.youtube.com/@lowbudgetlcs9513"
              rel="noopener"
              className={``}>
              <Button className="text-2xl">
                <FaYoutube />
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
