import { Route, Routes } from "react-router-dom";
import StatsMain from "../components/StatsPage/StatsMain";
import StatsSeason from "../components/StatsPage/StatsSeason";

const StatRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StatsMain />} />
      <Route path="stats/team/" element={<StatsSeason />} />
    </Routes>
  );
};

export default StatRoutes;
