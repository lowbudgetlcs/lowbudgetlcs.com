import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Twitch from "./components/Twitch";
import { LeagueDataProvider } from "./components/leagueDataContext";
import DraftNavbar from "./components/DraftTool/draftNavbars/DraftNavbar";
import { SettingsProvider } from "./components/DraftTool/providers/SettingsProvider";
import DraftSettings from "./components/DraftTool/DraftSettings";
import DraftRoutes from "./routes/DraftRoutes";
import DefaultRoutes from "./routes/DefaultRoutes";

function App() {
  // Finds the subdomain (used for draft site)
  const getSubdomain = (host: string) => {
    const parts = host.split(".");
    //! Change to > 2 on prod
    if (parts.length > 1) {
      return parts[0];
    }
    return null;
  };

  const location = useLocation();
  console.log(location);

  const currentHost = window.location.host; // e.g., "blog.localhost:3000" or "app.example.com"
  const subdomain = getSubdomain(currentHost);
  const isDraftRoute = subdomain === "draft";
  return (
    <div className=" relative font-serif bg-black">
      <ScrollToTop />
      {!isDraftRoute && <Twitch />}
      <SettingsProvider>
        <DraftSettings />
        {!isDraftRoute ? <Navbar /> : <DraftNavbar />}
        <LeagueDataProvider>
          <Routes>
            {subdomain === "draft" ? (
              <Route path="/*" element={<DraftRoutes />} />
            ) : (
              <Route path="/*" element={<DefaultRoutes />} />
            )}
          </Routes>
        </LeagueDataProvider>
      </SettingsProvider>
      {!isDraftRoute || (location.pathname === "/" && <Footer />)}
    </div>
  );
}

export default App;
