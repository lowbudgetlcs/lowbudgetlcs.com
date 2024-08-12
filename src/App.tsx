import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import About from "./components/About";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
