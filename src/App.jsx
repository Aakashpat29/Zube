import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Like from "./components/Like";
import History from "./pages/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="/login" element={<Login />} />
      <Route path="/likes" element={<Like />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;