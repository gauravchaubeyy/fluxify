import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Upload from "./pages/Upload";
import Play from "./pages/Play";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/play/:dashUrl" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}
