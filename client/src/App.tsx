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
import { useEffect } from "react";

function App() {
  // Finds the subdomain (used for draft site)
  const getSubdomain = (host: string) => {
    const parts = host.split(".");
    if (parts.length > 2) {
      return parts[0];
    }
    // if develeoping, will always return draft (since no .com with localhost)
    if (host.startsWith("draft.localhost")) {
      return "draft";
    }
    return null;
  };
  const location = useLocation();

  const currentHost = window.location.host;
  const pathname = window.location.pathname;
  const subdomain = getSubdomain(currentHost);
  const isDraftRoute = subdomain === "draft";

  useEffect(() => {
    if (pathname.startsWith("/draft")) {
      const baseHost = "lowbudgetlcs.com"; 
      const newPath = pathname.substring("/draft".length); 
      const newUrl = `${window.location.protocol}//draft.${baseHost}${newPath}${window.location.search}${window.location.hash}`;

      window.location.replace(newUrl);
    }
  }, [currentHost, pathname, subdomain]);
  console.log(location.pathname)
  // If a redirect is happening, you might want to render null or a loading spinner
  // to prevent the rest of the app from rendering momentarily.
  if (!subdomain && pathname.startsWith("/draft")) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
        <p>Redirecting...</p>
        <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
      </div>
    );
  }
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
      {(!isDraftRoute || location.pathname === "/") && <Footer />}
    </div>
  );
}

export default App;
