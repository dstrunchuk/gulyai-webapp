import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Form from "./pages/Form";
import Profile from "./pages/Profile";

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);

      fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${parsed.chat_id}`)
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem("user");
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("user");
          navigate("/");
        });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;