import { useState } from "react";
import StatsSearchUI from "./StatsSearchUI";

function StatsMain() {
  const [isSearchActive, setIsSearchActive] = useState<Boolean>(false);

  return (
    <div className="aboutbg-white text-black dark:bg-black dark:text-white font-serif">
      {isSearchActive ? (
        <div
          onClick={() => setIsSearchActive(false)}
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
          <p className="group-hover:text-orange underline transition duration-300 ">
            Back
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl text-center">LBLCS Stats</h1>
      </div>
      {isSearchActive ? (
        <StatsSearchUI />
      ) : (
        <div className="statsMainContainer flex flex-col md:flex-row justify-center p-8 gap-8">
          <div
            onClick={() => setIsSearchActive(true)}
            className={`relative card cursor-pointer bg-gradient-to-br from-orange to-black flex items-center justify-center w-full min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
          >
            <h2 className="text-3xl text-white text-center font-semibold z-10">
              Search Player
            </h2>
          </div>
          <div
            className={`relative card cursor-pointer bg-gradient-to-br from-orange to-black flex items-center justify-center w-full min-h-32 md:h-40 rounded-lg before:rounded-md before:bg-gray/80 before:dark:bg-light-gray before:z-0 before:absolute before:hover:opacity-0 before:w-full before:h-full before:transition-all before:duration-300`}
          >
            <h2 className="text-3xl text-white text-center font-semibold z-10">
              Team Stats
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsMain;
