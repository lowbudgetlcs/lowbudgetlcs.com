import { NavLink } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Button from "./Button";

function Summary() {

  const [ ref, inView ] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });
  const [ ref1, inView1 ] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });
  const [ ref2, inView2 ]= useInView({
    threshold: 0.25,
    triggerOnce: true,
  });
  return (
    <div className="summary p-8 flex flex-col items-center -mt-28 text-white/60">
      <div className="cardContainer flex flex-col gap-16 z-10 overflow-hidden">
        <div ref={ref} className={`card ${inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"} transition duration-700 flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40`}>
          <div className="w-full h-96 bg-cover bg-center text-center bg-[url('src/assets/summaryImg.jpg')] border-b-orange border-b-4 md:border-r-orange md:border-r-4"></div>
          <div className=" w-full md:w-1/2 p-2 md:p-4">
            <h2 className="text-xl text-white text-center font-semibold p-2">
              Amateurs Unite!
            </h2>
            <p className="py-2 text-sm md:text-md">
              The LowBudget LCS is a competitive, free, and friendly amateur rec
              league. We have 4 leagues that range across all skill levels. We
              provide an experience that mirrors what would happen if Riot Games
              suffered a catastrophic financial disaster. Season 13 is starting
              in the fall!
            </p>
            <div className="font-semibold">
              <NavLink to="/about">
                <Button>Learn More</Button>
              </NavLink>
            </div>
          </div>
        </div>
        <div ref={ref1} className={`card ${inView1 ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"} transition duration-700 flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40`}>
          <div className=" w-full md:w-1/2 p-2 md:p-4">
            <h2 className="text-xl text-white text-center font-semibold p-2">
              Watch Games Live
            </h2>
            <p className="py-2 text-sm md:text-md">
              Watch matches from all brackets live on Twitch! Cheer on your
              favorite team as they win big (or int big) while interacting with
              both the casters and community. Earn all the Schmeckles you can!
            </p>
            <div className="font-semibold mt-4">
              <NavLink
                target="_blank"
                to={"https://www.twitch.tv/lowbudgetlcs"}
              >
                <Button>Watch Here</Button>
              </NavLink>
            </div>
          </div>
          <div className="w-full h-96 bg-cover bg-center text-center bg-[url('src/assets/twitchPhone.jpg')] border-t-orange border-t-4 md:border-l-orange md:border-l-4"></div>
        </div>
        <div ref={ref2} className={`card ${inView2 ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"} transition duration-700 flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40`}>
          <div className="w-full h-96 bg-cover bg-center text-center bg-[url('src/assets/smilingGamer.jpg')] border-b-orange border-b-4 md:border-r-orange md:border-r-4"></div>
          <div className=" w-full md:w-1/2 p-2 md:p-4">
            <h2 className="text-xl text-white text-center font-semibold p-2">
              Have a Blast with Friends
            </h2>
            <p className="py-2 text-sm md:text-md">
              The LBLCS is a community where players of all ranks can meet
              awesome people, play organized League of Legends, and find a
              welcome environment for just about everything! Show off your pets,
              share cool memes, and talk it up with the community!
            </p>
            <div className="font-semibold">
              <NavLink target="_blank" to={"https://discord.gg/lblcs"}>
                <Button>Join The Discord</Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
