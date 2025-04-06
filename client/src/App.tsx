import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/AboutPage/About";
import ScrollToTop from "./components/ScrollToTop";
import Twitch from "./components/Twitch";
import Roster from "./components/RosterPage/Roster";
import LeaguePlayers from "./components/RosterPage/LeaguePlayers";
import ErrorPage from "./components/ErrorPage";
import { LeagueDataProvider } from "./components/leagueDataContext";
import AllStars from "./components/AllStarsPage/AllStars";
import ASEconomy from "./components/AllStarsPage/ASEconomy";
import ASCommercial from "./components/AllStarsPage/ASCommercial";
import ASFinancial from "./components/AllStarsPage/ASFinancial";
import ASExecutive from "./components/AllStarsPage/ASExecutive";
import StatsMain from "./components/StatsPage/StatsMain";
// import StatsPlayer from "./components/StatsPage/StatsPlayer";
import StatsSeason from "./components/StatsPage/StatsSeason";
// import StatsTeamUI from "./components/StatsPage/StatsTeamUI";
import CreateDraft from "./components/DraftTool/draftCreation/CreateDraft";
import DraftPage from "./components/DraftTool/mainPages/DraftPage";
import FearlessMain from "./components/DraftTool/mainPages/FearlessMain";
import { FearlessProvider } from "./components/DraftTool/providers/FearlessProvider";
import FearlessDraftPage from "./components/DraftTool/mainPages/FearlessDraftPage";
import { SocketProvider } from "./components/DraftTool/providers/SocketProvider";
import { DraftProvider } from "./components/DraftTool/providers/DraftProvider";
import DraftNavbar from "./components/DraftTool/draftNavbars/DraftNavbar";

function App() {
  const location = useLocation();
  const isDraftRoute = location.pathname.startsWith("/draft/");
  return (
    <div className=" relative font-serif bg-black">
      <ScrollToTop />
      {!isDraftRoute && <Twitch />}
      {!isDraftRoute ? <Navbar /> : <DraftNavbar/>}
      <LeagueDataProvider>
        <Routes>
          <Route element={<SocketProvider />}>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="rosters" element={<Roster />} />
            <Route path="rosters/:league" element={<LeaguePlayers />} />
            <Route path="allstars" element={<AllStars />}>
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
            <Route path="draft" element={<CreateDraft />} />
            <Route element={<DraftProvider />}>
              <Route path="draft/:lobbyCode" element={<DraftPage />} />
              <Route
                path="draft/:lobbyCode/:sideCode"
                element={<DraftPage />}
              />
            </Route>
            <Route element={<FearlessProvider />}>
              <Route
                path="draft/fearless/:fearlessCode"
                element={<FearlessMain />}
              />
              <Route
                path="draft/fearless/:fearlessCode/:teamCode"
                element={<FearlessMain />}
              />
              <Route element={<DraftProvider />}>
                <Route
                  path="draft/fearless/:fearlessCode/:teamCode/:lobbyCode"
                  element={<FearlessDraftPage />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </LeagueDataProvider>
      {!isDraftRoute && <Footer />}
    </div>
  );
}

export default App;
