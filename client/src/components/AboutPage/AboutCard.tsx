import { useInView } from "react-intersection-observer";
import { NavLink } from "react-router-dom";

interface AboutCardProps {
  title: string;
  rank: string;
  average: string;
  color: string;
  sheet: string;
}

function AboutCard({ title, sheet }: AboutCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  return (
    <div>
      <NavLink
        ref={ref}
        target="_blank"
        to={sheet}
        state={{ league: title }}
        className={`card ${
          inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        } transition duration-300 flex justify-center items-center w-80 md:w-60 p-12 overflow-hidden gap-4 rounded-lg bg-gray/80 dark:bg-gray/40 hover:bg-orange`}
      >
        <div className="text-3xl text-white text-center font-semibold cursor-pointer z-10">
          {title}
        </div>
        {/* <div
          className={`absolute right-0 bottom-0 h-2 w-full md:h-full md:w-2  group-hover:h-full md:group-hover:w-full ${color} transition-all duration-500`}
        ></div> */}
      </NavLink>
      {/* <div className="min-w-48 h-24 flex items-center max-w-lg p-2 md:p-4">
        <ul>
          <li className="text-md md:text-lg">
            Maximum Rank: <span className="text-white/60">{rank}</span>
          </li>
          <li className="text-md md:text-lg">
            Average Rank: <span className="text-white/60">{average}</span>
          </li>
        </ul>
      </div> */}
    </div>
  );
}

export default AboutCard;
