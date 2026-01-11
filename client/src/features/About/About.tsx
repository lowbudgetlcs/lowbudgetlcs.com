import { NavLink } from "react-router-dom";
import Button from "../../components/Button";
import InfoCard from "./components/InfoCard";
import twitchImage from "../../assets/twitchPhone.jpg";
import discordImage from "../../assets/smilingGamer.jpg";

const leagues = [
  {
    title: "Economy",
    sheet: `https://docs.google.com/spreadsheets/d/1UrJs45Gi8d82wQhRY6gsanrLHc0UzBKeJx_PJHMcYLk/edit?usp=sharing`,
  },
  {
    title: "Commercial",
    sheet: "https://docs.google.com/spreadsheets/d/1I0oUEWldXPoC2IbjlAa5cmm_x3C1M07Y3u6Wvk2uucA/edit?usp=sharing",
  },
  {
    title: "Financial",
    sheet: "https://docs.google.com/spreadsheets/d/15G-v2bcnOnuJWRRHlRDetPaKqNqwaNo7tXMhXT5gWRw/edit?usp=sharing",
  },
  {
    title: "Executive",
    sheet: "https://docs.google.com/spreadsheets/d/1XGm7WEBEvns_0QeyKzMzF6kiaUfYfLf39ZpCqntkVAI/edit?usp=sharing",
  },
  {
    title: "CEO",
    sheet: "https://docs.google.com/spreadsheets/d/1Htqg10TNDqLZ4D6paAKF1zAN4H6A2hoYfyn1eLTjApo/edit?usp=sharing",
  },
];

function About() {
  const twitchCard = {
    title: "Watch Games Live",
    text: `Watch matches from all brackets live on Twitch! Cheer on your favorite team as they win big (or int big) while interacting with both the casters and community. Earn all the Schmeckles you can!`,
    link: "https://www.twitch.tv/lowbudgetlcs",
    btnText: "Watch Here",
    image: twitchImage,
    newTab: true,
  };

  const discordCard = {
    title: "Have a Blast with Friends",
    text: `The LBLCS is a community where players of all ranks can meet awesome people, play organized League of Legends, and find a welcome environment for just about everything! Show off your pets, share cool memes, and talk it up with the community!`,
    link: "https://discord.com/invite/XfsEEq4aPC",
    btnText: "Join The Discord",
    image: discordImage,
    newTab: true,
  };

  return (
    <div className="about bg-white text-black dark:bg-black dark:text-white font-serif pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 lg:py-16">
          <div className="flex flex-col gap-6 max-w-xl text-center lg:text-left">
            <div>
              <h1 className="text-5xl font-bold tracking-tight mb-4">About Us</h1>
              <div className="h-1 w-24 bg-primary-light rounded-full mx-auto lg:mx-0" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
              The Low Budget LCS is a competitive, free, and friendly amateur rec
              league. We have multiple leagues that range across all skill levels.
              We provide an experience that mirrors what would happen if Riot Games
              suffered a catastrophic financial disaster.
            </p>
          </div>

          <div className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-bg aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/F0lBGhmm0cw?si=oJYSNPP6S6rnjMXN"
              title="LBLCS Welcome Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </div>

        {/* Divisions Section */}
        <div className="flex flex-col items-center gap-8 py-12 border-t border-white/10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Our Divisions</h2>
            <p className="text-base text-gray-400 max-w-2xl">
              The Low Budget LCS has five separate divisions defined by both max
              rank and a points system. Click below to view the stats.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl">
            {leagues.map((league) => (
              <NavLink target="_blank" to={league.sheet} key={league.title}>
                <Button className="min-w-[140px]">{league.title}</Button>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="flex flex-col gap-8 w-full py-8">
          <InfoCard {...twitchCard} reverse={false} />
          <InfoCard {...discordCard} reverse={true} />
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-center items-center text-center py-12 border-t border-white/10">
          <p className="text-lg md:text-xl py-4 pb-8 text-gray-200">
            For more detailed information check out the rules document!
          </p>
          <NavLink
            target="_blank"
            to={
              "https://docs.google.com/document/d/1gwZpciwnRG8nao42zNZCKxwXf7fgdFXQm-tDAaQ6T1I/edit?usp=sharing"
            }
          >
            <Button>Rules Document</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default About;
