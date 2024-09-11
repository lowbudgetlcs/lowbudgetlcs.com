import Hero from "./Hero";
import Summary from "./Summary";

function Home() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Hero />
      <Summary />
    </div>
  );
}

export default Home;
