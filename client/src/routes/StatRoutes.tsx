import { Route, Routes } from "react-router-dom";
import StatsMain from "../components/StatsPage/StatsMain";
import Footer from "../components/Footer";
import StatsPlayer from "../components/StatsPage/PlayerStatDisplay/StatsPlayer";
import TeamSelect from "../components/StatsPage/TeamStatDisplay/TeamSelect";

const StatRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <Routes>
        <Route path="/" element={<StatsMain />} />
        <Route path="team/" element={<TeamSelect />} />
        <Route path="player/:summonerName" element={<StatsPlayer />} />
      </Routes>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default StatRoutes;
