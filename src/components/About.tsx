import { NavLink } from "react-router-dom";
import AboutCard from "./AboutCard";
import Button from "./Button";

const economy = {
  title: "Economy",
  rank: "Platinum I",
  average: "Gold",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-gold-light to-gold-dark",
};
const commercial = {
  title: "Commercial",
  rank: "Emerald I",
  average: "Platinum",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-platinum-light to-platinum-dark",
};
const financial = {
  title: "Financial",
  rank: "Diamond II",
  average: "Emerald",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-emerald-light to-emerald-dark",
};
const executive = {
  title: "Executive",
  rank: "Challenger",
  average: "Diamond",
  color: "bg-gradient-to-r md:bg-gradient-to-b from-challenger-blue to-challenger-gold",
};

function About() {
  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">About</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          The Low Budget LCS has four separate leagues defined by both max rank
          and a points system.
        </p>
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
        <NavLink to={'https://docs.google.com/document/d/1poO5lo9Mh8k85Vhh3UNCFJNxvSfsWGTkN7v-EdT9Rp8/edit?usp=sharing'}>
              <Button>Rules Document</Button>
            </NavLink>
      </div>
    </div>
  );
}

export default About;
