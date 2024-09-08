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
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </LeagueDataProvider>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
