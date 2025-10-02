import { Route, Routes } from "react-router-dom";
import StatsMain from "../components/StatsPage/StatsMain";
import StatsSeason from "../components/StatsPage/StatsSeason";
import Footer from "../components/Footer";

const StatRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<StatsMain />} />
        <Route path="stats/team/" element={<StatsSeason />} />
      </Routes>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
};

export default StatRoutes;
