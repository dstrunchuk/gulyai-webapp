import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Form from "./pages/Form";
import Profile from "./pages/Profile";

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    console.log("localStorage:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (!parsed.chat_id) {
          console.warn("chat_id отсутствует, чистим localStorage");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        console.log("Проверяем профиль по chat_id:", parsed.chat_id);

        fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${parsed.chat_id}`)
          .then((res) => {
            console.log("Ответ от бэка:", res.status);
            if (!res.ok) {
              console.warn("Профиль не найден. Удаляем localStorage");
              localStorage.removeItem("user");
              navigate("/");
            }
          })
          .catch((err) => {
            console.error("Ошибка запроса:", err);
            localStorage.removeItem("user");
            navigate("/");
          });
      } catch (err) {
        console.error("Ошибка парсинга localStorage:", err);
        localStorage.removeItem("user");
        navigate("/");
      }
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