import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/LeaguesPage/About";
import ScrollToTop from "./components/ScrollToTop";
import Twitch from "./components/Twitch";
import Roster from "./components/RosterPage/Roster";
import LeagueGroups from "./components/RosterPage/LeagueGroups";
import LeaguePlayers from "./components/RosterPage/LeaguePlayers";
import ErrorPage from "./components/ErrorPage";
import { LeagueDataProvider } from "./components/leagueDataContext";
import AllStars from "./components/AllStarsPage/AllStars";
import ASEconomy from "./components/AllStarsPage/ASEconomy";
import ASCommercial from "./components/AllStarsPage/ASCommercial";
import ASFinancial from "./components/AllStarsPage/ASFinancial";
import ASExecutive from "./components/AllStarsPage/ASExecutive";
import StatsMain from "./components/StatsPage/StatsMain";
import StatsPlayer from "./components/StatsPage/StatsPlayer";
import StatsSeason from "./components/StatsPage/StatsSeason";
import StatsTeam from "./components/StatsPage/StatsTeam";

function App() {
  return (
    <div className=" relative font-serif min-h-screen bg-black">
      <BrowserRouter>
        <ScrollToTop />
        <Twitch />
        <Navbar />
        <LeagueDataProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="rosters" element={<Roster />} />
            <Route path="rosters/:league" element={<LeagueGroups />} />
            <Route path="rosters/:league/:group" element={<LeaguePlayers />} />
            <Route path="allstars" element={<AllStars />}>
              <Route path="economy" element={<ASEconomy/>}/>
              <Route path="commercial" element={<ASCommercial/>}/>
              <Route path="financial" element={<ASFinancial/>}/>
              <Route path="executive" element={<ASExecutive/>}/>
            </Route>
            <Route path="stats" element={<StatsMain/>}/>
            <Route path="stats/player/:player" element={<StatsPlayer/>}/>
            <Route path="stats/team/" element={<StatsSeason/>}/>
            <Route path="stats/team/:team" element={<StatsTeam/>}/>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </LeagueDataProvider>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
