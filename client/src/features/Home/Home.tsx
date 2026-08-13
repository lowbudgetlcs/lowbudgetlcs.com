import Twitch from "../Twitch/Twitch";
import Hero from "./components/Hero";

function Home() {
  return (
    <>
      <Twitch />
      <div className="dark:bg-bg-dark text-black dark:text-white">
        <Hero />
      </div>
    </>
  );
}

export default Home;
