import { Route, Routes } from "react-router-dom";
import Home from "../components/HomePage/Home";
import About from "../components/AboutPage/About";
import Roster from "../components/RosterPage/Roster";
import LeaguePlayers from "../components/RosterPage/LeaguePlayers";
import ASMain from "../components/AllStarsPage/ASMain";
import ASEconomy from "../components/AllStarsPage/ASEconomy";
import ASCommercial from "../components/AllStarsPage/ASCommercial";
import ASFinancial from "../components/AllStarsPage/ASFinancial";
import ASExecutive from "../components/AllStarsPage/ASExecutive";
import StatsMain from "../components/StatsPage/StatsMain";
import StatsSeason from "../components/StatsPage/StatsSeason";
import ErrorPage from "../components/ErrorPage";
import Footer from "../components/Footer";

const DefaultRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rosters" element={<Roster />} />
          <Route path="rosters/:league" element={<LeaguePlayers />} />
          <Route path="allstars" element={<ASMain />}>
            <Route path="economy" element={<ASEconomy />} />
            <Route path="commercial" element={<ASCommercial />} />
            <Route path="financial" element={<ASFinancial />} />
            <Route path="executive" element={<ASExecutive />} />
          </Route>
          <Route path="stats" element={<StatsMain />} />
          {/* <Route path="stats/player/:player" element={<StatsPlayer/>}/> */}
          <Route path="stats/team/" element={<StatsSeason />} />
          {/* <Route path="stats/team/:team" element={<StatsTeamUI/>}/> */}
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
