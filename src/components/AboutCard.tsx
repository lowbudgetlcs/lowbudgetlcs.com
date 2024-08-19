import { useInView } from "react-intersection-observer";

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
      } transition duration-1000 flex flex-col md:flex-row items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden gap-4 rounded-lg bg-gray/40`}
    >
      <div
        className={`relative w-full h-24 md:w-56 md:h-full flex items-center justify-center text-center`}
      >
        <h2 className="text-3xl text-white text-center font-semibold">
          {title}

        </h2>
        <div className={`absolute right-0 bottom-0 h-2 w-full md:h-full md:w-2 ${color}`}></div>
      </div>
      <div className="min-w-48 h-24 flex items-center max-w-lg p-2 md:p-4">
        <ul>
          <li className="text-md md:text-lg">Maximum Rank: <span className="text-white/60">{rank}</span></li>
          <li className="text-md md:text-lg">Average Rank: <span className="text-white/60">{average}</span></li>
        </ul>
      </div>
    </div>
  );
}

export default AboutCard;
