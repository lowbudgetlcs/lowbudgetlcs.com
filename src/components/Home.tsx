import Hero from "./Hero";
import Summary from "./Summary";
import Twitch from "./Twitch";

function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Summary />
      <Twitch />
    </div>
  );
}

export default Home;
