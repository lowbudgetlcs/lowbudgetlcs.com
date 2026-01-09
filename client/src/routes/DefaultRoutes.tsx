import { Route, Routes } from "react-router-dom";
import About from "../features/About/About";
import Roster from "../features/Roster/Roster";
import LeaguePlayers from "../features/Roster/components/LeaguePlayers";
import AllStars from "../features/AllStars/AllStars";
import ErrorPage from "../components/ErrorPage";
import Footer from "../components/Footer";
import Home from "../features/Home/Home";
import MatchHistory from "../features/MatchHistory/MatchHistory";

const DefaultRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rosters" element={<Roster />} />
          <Route path="rosters/:league" element={<LeaguePlayers />} />
          <Route path="allstars" element={<AllStars />} />
          <Route path="mh" element={<MatchHistory />} />
          <Route path="mh/:matchID" element={<MatchHistory />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default DefaultRoutes;
