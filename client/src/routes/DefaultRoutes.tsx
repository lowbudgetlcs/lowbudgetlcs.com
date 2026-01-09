import { Route, Routes } from "react-router-dom";
import About from "../components/AboutPage/About";
import Roster from "../features/Roster/Roster";
import LeaguePlayers from "../features/Roster/components/LeaguePlayers";
import AllStars from "../features/AllStars/AllStars";
import ErrorPage from "../components/ErrorPage";
import Footer from "../components/Footer";
import MHHome from "../components/MatchHistoryPage/MHHome";
import Home from "../features/Home/Home";

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
          <Route path="mh" element={<MHHome />} />
          <Route path="mh/:matchID" element={<MHHome />} />
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
