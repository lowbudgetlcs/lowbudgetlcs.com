import { Route, Routes } from "react-router-dom";
import StatsMain from "../components/StatsPage/StatsMain";
import StatsSeason from "../components/StatsPage/StatsSeason";
import Footer from "../components/Footer";
import StatsPlayer from "../components/StatsPage/PlayerStatDisplay/StatsPlayer";

const StatRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<StatsMain />} />
        <Route path="team/" element={<StatsSeason />} />
        <Route path="player/:summonerName" element={<StatsPlayer />} />
      </Routes>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default StatRoutes;
