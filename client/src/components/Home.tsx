import Hero from "./Hero";
import Summary from "./Summary";
import Twitch from "./Twitch";
// import Twitch from "./Twitch";

function Home() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Twitch/>
      <Hero />
      <Summary />
    </div>
  );
}

export default Home;
