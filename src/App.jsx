function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const chatId = parsed.chat_id;

        if (!chatId) {
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${chatId}`)
          .then((res) => {
            if (!res.ok) {
              localStorage.removeItem("user");
              navigate("/");
            } else {
              // Анкета найдена — переходим на профиль
              navigate("/profile");
            }
          })
          .catch(() => {
            localStorage.removeItem("user");
            navigate("/");
          });
      } catch {
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