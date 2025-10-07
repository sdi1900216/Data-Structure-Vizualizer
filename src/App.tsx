import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import StackPage from "./pages/StackPage";
import QueuePage from "./pages/QueuePage";
import LinkedListPage from "./pages/LinkedListPage";

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#0e0e13",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <img src={logo} alt="Logo" style={{ width: 200, marginBottom: 40 }} />
      <h1>Data Structure Visualizer</h1>
      <p>Choose the Data Structure you wish to simulate!</p>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/stack")} style={{ marginRight: 12, padding: "10px 20px" }}>Stack</button>
        <button onClick={() => navigate("/queue")} style={{ padding: "10px 20px" }}>Queue</button>
        <button onClick={() => navigate("/linkedlist")}>Linked List</button>
      </div>
      <p>Created by Thanos Chatzis.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/linkedlist" element={<LinkedListPage />} />
      </Routes>
    </Router>
  );
}