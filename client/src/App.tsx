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
        <Route path="rosters" element={<Roster />}>
          <Route path="economy" element={<LeagueGroups />}>
            <Route path="a" element={<LeaguePlayers />} />
            <Route path="b" element={<LeaguePlayers />} />
            <Route path="c" element={<LeaguePlayers />} />
            <Route path="d" element={<LeaguePlayers />} />
          </Route>
          <Route path="commercial" element={<LeagueGroups />}>
            <Route path="a" element={<LeaguePlayers />} />
            <Route path="b" element={<LeaguePlayers />} />
            <Route path="c" element={<LeaguePlayers />} />
            <Route path="d" element={<LeaguePlayers />} />
          </Route>
          <Route path="financial" element={<LeagueGroups />}>
            <Route path="a" element={<LeaguePlayers />} />
            <Route path="b" element={<LeaguePlayers />} />
            <Route path="c" element={<LeaguePlayers />} />
            <Route path="d" element={<LeaguePlayers />} />
          </Route>
          <Route path="executive" element={<LeagueGroups />}>
            <Route path="a" element={<LeaguePlayers />} />
            <Route path="b" element={<LeaguePlayers />} />
            <Route path="c" element={<LeaguePlayers />} />
            <Route path="d" element={<LeaguePlayers />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
