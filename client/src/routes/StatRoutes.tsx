import { Route, Routes } from "react-router-dom";
import Footer from "../layout/Footer";
import StatsPlayer from "../features/Stats/components/PlayerStatDisplay/StatsPlayer";
import TeamSelect from "../features/Stats/components/TeamStatDisplay/TeamSelect";
import TeamDisplay from "../features/Stats/components/TeamStatDisplay/TeamDisplay";
import Stats from "../features/Stats/Stats";

const StatRoutes = () => {
  return (
      <div className="flex flex-col min-h-screen items-center">
        <Routes>
          <Route index element={<Stats />} />
          <Route path="team" element={<TeamSelect />} />
          <Route path="player/:summonerName" element={<StatsPlayer />} />
          <Route path="team/:teamName" element={<TeamDisplay />} />
        </Routes>
        <div className="flex-none">
          <Footer />
        </div>
      </div>
  );
};

export default StatRoutes;
