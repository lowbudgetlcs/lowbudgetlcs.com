import { NavLink } from "react-router-dom";
import AboutCard from "./AboutCard";
import Button from "../Button";

const economy = {
  title: "Economy",
  rank: "Platinum III",
  average: "Gold",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-gold-light to-gold-dark",
};
const commercial = {
  title: "Commercial",
  rank: "Emerald III",
  average: "Platinum",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-platinum-light to-platinum-dark",
};
const financial = {
  title: "Financial",
  rank: "Diamond III",
  average: "Emerald",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-emerald-light to-emerald-dark",
};
const executive = {
  title: "Executive",
  rank: "Uncapped",
  average: "Diamond",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-challenger-blue to-challenger-gold",
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
          and a points system. We have 2 seasons a year starting in the spring and the fall. Currently we are in season 13!
        </p>
        <p className="text-white/60 text-lg px-8 p-8 text-center">Click on a league title to look at this season's roster!</p>
        <div className="cardContainer flex flex-col gap-8 z-10 w-3/5 overflow-hidden">
          <AboutCard
            title={economy.title}
            rank={economy.rank}
            average={economy.average}
            color={economy.color}
          />
          <AboutCard
            title={commercial.title}
            rank={commercial.rank}
            average={commercial.average}
            color={commercial.color}
          />
          <AboutCard
            title={financial.title}
            rank={financial.rank}
            average={financial.average}
            color={financial.color}
          />
          <AboutCard
            title={executive.title}
            rank={executive.rank}
            average={executive.average}
            color={executive.color}
          />
        </div>
        <p className="summary text-lg md:text-xl px-16 py-4">
          For more detailed information check out the rules document!
        </p>
        <NavLink target="_blank" to={'https://docs.google.com/document/d/1poO5lo9Mh8k85Vhh3UNCFJNxvSfsWGTkN7v-EdT9Rp8/edit?usp=sharing'}>
              <Button>Rules Document</Button>
            </NavLink>
      </div>
    </div>
  );
}

export default About;
