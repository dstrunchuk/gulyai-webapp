import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Form from "./pages/Form";
import Profile from "./pages/Profile";

function AppWrapper() {
  const navigate = useNavigate();

  uuseEffect(() => {
    const stored = localStorage.getItem("user");
    console.log("Проверка localStorage:", stored);
  
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("Ищу профиль по chat_id:", parsed.chat_id);
  
      fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${parsed.chat_id}`)
        .then((res) => {
          console.log("Ответ от сервера:", res.status);
          if (!res.ok) {
            console.warn("Профиль не найден. Удаляю localStorage");
            localStorage.removeItem("user");
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Ошибка при fetch:", err);
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