import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Chatpage from "./pages/Chatpages/Chatpage";
import Home from "./pages/Home/Home";
import { useNavigate } from "react-router-dom";
import "./App.css";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chatpage");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatpage" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
