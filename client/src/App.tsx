import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import About from "./components/About";
import Error from "./components/Error";
import ScrollToTop from "./components/ScrollToTop";
import Twitch from "./components/Twitch";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error />} />
        <Route path="/twitch" element={<Twitch />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
