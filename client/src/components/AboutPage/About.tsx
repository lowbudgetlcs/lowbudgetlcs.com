import { NavLink } from "react-router-dom";
import AboutCard from "./AboutCard";
import Button from "../Button";

const economy = {
  title: "Economy",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: `https://docs.google.com/spreadsheets/d/1UrJs45Gi8d82wQhRY6gsanrLHc0UzBKeJx_PJHMcYLk/edit?usp=sharing`,
};
const commercial = {
  title: "Commercial",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet:
    "https://docs.google.com/spreadsheets/d/1I0oUEWldXPoC2IbjlAa5cmm_x3C1M07Y3u6Wvk2uucA/edit?usp=sharing",
};
const financial = {
  title: "Financial",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet:
    "https://docs.google.com/spreadsheets/d/15G-v2bcnOnuJWRRHlRDetPaKqNqwaNo7tXMhXT5gWRw/edit?usp=sharing",
};
const executive = {
  title: "Executive",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet:
    "https://docs.google.com/spreadsheets/d/1XGm7WEBEvns_0QeyKzMzF6kiaUfYfLf39ZpCqntkVAI/edit?usp=sharing",
};
const ceo = {
  title: "CEO",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet:
    "https://docs.google.com/spreadsheets/d/1Htqg10TNDqLZ4D6paAKF1zAN4H6A2hoYfyn1eLTjApo/edit?usp=sharing",
};

function About() {
  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">About</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-8 w-full md:w-2/3 py-8 md:text-center">
          The Low Budget LCS is a competitive, free, and friendly amateur rec
          league. We have multiple leagues that range across all skill levels.
          We provide an experience that mirrors what would happen if Riot Games
          suffered a catastrophic financial disaster.
        </p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/F0lBGhmm0cw?si=oJYSNPP6S6rnjMXN"
          title="LBLCS Welcome Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="max-w-full md:max-w-[560px] p-4"
        ></iframe>
        <p className="text-lg md:text-xl w-full md:w-2/3 px-8 pt-4 text-center">
          The Low Budget LCS has four separate divisions defined by both max
          rank and a points system.
        </p>
        <p className="text-white/60 text-lg px-8 pt-2 pb-8 text-center">
          Click on a league to look at their Google Sheet!
        </p>
        <div className="cardContainer flex flex-col md:flex-row items-center justify-center flex-wrap gap-8 z-10 w-full md:px-8">
          <AboutCard
            title={economy.title}
            rank={economy.rank}
            average={economy.average}
            color={economy.color}
            sheet={economy.sheet}
          />
          <AboutCard
            title={commercial.title}
            rank={commercial.rank}
            average={commercial.average}
            color={commercial.color}
            sheet={commercial.sheet}
          />
          <AboutCard
            title={financial.title}
            rank={financial.rank}
            average={financial.average}
            color={financial.color}
            sheet={financial.sheet}
          />
          <AboutCard
            title={executive.title}
            rank={executive.rank}
            average={executive.average}
            color={executive.color}
            sheet={executive.sheet}
          />
          <AboutCard
            title={ceo.title}
            rank={ceo.rank}
            average={executive.average}
            color={executive.color}
            sheet={ceo.sheet}
          />
        </div>
        <div className=" flex flex-col justify-center items-center text-center px-16">
          <p className="summary text-lg md:text-xl py-4">
            For more detailed information check out the rules document!
          </p>

          <NavLink
            target="_blank"
            to={
              "https://docs.google.com/document/d/16uYlGmADc1x1v3MXQhRgUqICNabnjxqiirJmw7W-tQI/edit?usp=sharing"
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
