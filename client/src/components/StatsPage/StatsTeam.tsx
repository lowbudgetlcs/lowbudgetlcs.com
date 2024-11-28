import { Link } from "react-router-dom";
import Button from "../Button";

function StatsTeam() {
  return (
    <div className="seasonList flex flex-col flex-grow">
      <Link
        to={`/stats`}
        className="fixed flex z-50 my-2 px-2 rounded-lg top-1 left-16 text-2xl font-semibold cursor-pointer w-fit h-fit justify-center items-center  group"
      >
        <div className="burger cursor-pointer relative h-12 w-6 gap-1 hover:cursor-pointer self-baseline">
          <div
            className={`absolute -rotate-45 top-5 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
          <div
            className={`absolute rotate-45 top-7 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
        </div>
        <p className="group-hover:text-orange underline transition duration-300">
          Back
        </p>
      </Link>
      <h2 className="text-center text-xl font-bold">Choose a Season</h2>
      <Button>
        Season 13 <br /> <span>Summer/Fall 2023</span>
      </Button>
    </div>
  );
}

export default StatsTeam;
