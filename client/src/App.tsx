import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import About from "./components/About";
import Error from "./components/Error";
import ScrollToTop from "./components/ScrollToTop";
//! Enable Twitch on prod
import Twitch from "./components/Twitch";
import Roster from "./components/Roster";
import LeagueGroups from "./components/LeagueGroups";
import LeaguePlayers from "./components/LeaguePlayers";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Error />} />
        <Route path="rosters" element={<Roster />} />

        {/* Economy League */}
        <Route path="rosters/economy" element={<LeagueGroups />} />
        <Route path="rosters/economy/a" element={<LeaguePlayers />} />
        <Route path="rosters/economy/b" element={<LeaguePlayers />} />
        <Route path="rosters/economy/c" element={<LeaguePlayers />} />
        <Route path="rosters/economy/d" element={<LeaguePlayers />} />

        {/* Commercial League */}
        <Route path="rosters/commercial" element={<LeagueGroups />} />
        <Route path="rosters/commercial/a" element={<LeaguePlayers />} />
        <Route path="rosters/commercial/b" element={<LeaguePlayers />} />
        <Route path="rosters/commercial/c" element={<LeaguePlayers />} />
        <Route path="rosters/commercial/d" element={<LeaguePlayers />} />

        {/* Financial League */}
        <Route path="rosters/financial" element={<LeagueGroups />} />
        <Route path="rosters/financial/a" element={<LeaguePlayers />} />
        <Route path="rosters/financial/b" element={<LeaguePlayers />} />
        <Route path="rosters/financial/c" element={<LeaguePlayers />} />
        <Route path="rosters/financial/d" element={<LeaguePlayers />} />

        {/* Executive League */}
        <Route path="rosters/executive" element={<LeagueGroups />} />
        <Route path="rosters/executive/a" element={<LeaguePlayers />} />
        <Route path="rosters/executive/b" element={<LeaguePlayers />} />
        <Route path="rosters/executive/c" element={<LeaguePlayers />} />
        <Route path="rosters/executive/d" element={<LeaguePlayers />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
