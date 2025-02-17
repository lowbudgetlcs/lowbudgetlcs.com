import { NavLink } from "react-router-dom";
import AboutCard from "./AboutCard";
import Button from "../Button";

const economy = {
  title: "Economy",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: `https://docs.google.com/spreadsheets/d/1UrJs45Gi8d82wQhRY6gsanrLHc0UzBKeJx_PJHMcYLk/edit?usp=sharing`
};
const commercial = {
  title: "Commercial",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: ""
};
const financial = {
  title: "Financial",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: ""
};
const executive = {
  title: "Executive",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: ""
};
const ceo = {
  title: "CEO",
  rank: "",
  average: "",
  color: "bg-orange",
  sheet: ""
};

function About() {
  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">Leagues</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-8 w-full md:w-2/3 pt-8 md:text-center">
          The Low Budget LCS has four separate leagues defined by both max rank
          and a points system. We have 2 seasons a year starting in the spring
          and the fall. Currently we are in season 13!
        </p>
        <p className="text-white/60 text-lg px-8 p-8 text-center">
          Click on a league title to look at this season's roster!
        </p>
        <div className="cardContainer grid grid-cols-1 md:grid-cols-2 xl:flex  gap-8 z-10 w-full lg:px-8 xl:w-3/5 overflow-hidden">
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
        <p className="summary text-lg md:text-xl px-16 py-4">
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
  );
}

export default About;
