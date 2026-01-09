import Hero from "./components/Hero";
import Summary from "./components/Summary";


function Home() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Hero />
      <Summary />
    </div>
  );
}

export default Home;
