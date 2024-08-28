import { useInView } from "react-intersection-observer";
import { NavLink } from "react-router-dom";

interface AboutCardProps {
  title: string;
  rank: string;
  average: string;
  color: string;
}

function AboutCard({ title, rank, average, color }: AboutCardProps) {
  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`card ${
        inView ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      } transition duration-1000 flex flex-col md:flex-row items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden gap-4 rounded-lg bg-gray/80 dark:bg-gray/40`}
    >
      <NavLink
        to={`/rosters/${title.toLowerCase()}`}
        state={{ league: title }}
        className={`relative group w-full h-24 md:w-56 md:h-full flex items-center justify-center text-center`}
      >
        <div className="text-3xl text-white text-center font-semibold cursor-pointer z-10">
          {title}
        </div>
        <div
          className={`absolute right-0 bottom-0 h-2 w-full md:h-full md:w-2  group-hover:h-full md:group-hover:w-full ${color} transition-all duration-500`}
        ></div>
      </NavLink>
      <div className="min-w-48 h-24 flex items-center max-w-lg p-2 md:p-4">
        <ul>
          <li className="text-md md:text-lg">
            Maximum Rank: <span className="text-white/60">{rank}</span>
          </li>
          <li className="text-md md:text-lg">
            Average Rank: <span className="text-white/60">{average}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AboutCard;
