import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState("");
  const [vibe, setVibe] = useState("");
  const [privacy, setPrivacy] = useState(null);
  const [status, setStatus] = useState("inactive");
  const [duration, setDuration] = useState("1");

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const stored = localStorage.getItem("user");
    if (stored) {
      const data = JSON.parse(stored);
      setUser(data);
      setGoal(data.activity || "");
      setVibe(data.vibe || "");
      setPrivacy(data.privacy_filter || null);
      setStatus(data.status || "inactive");
    }
  }, []);

  const handleUpdate = async (field, value) => {
    if (!user?.chat_id) return;
    const updated = { [field]: value };
    setUser((prev) => ({ ...prev, ...updated }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
    await fetch("https://gulyai-backend-production.up.railway.app/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: user.chat_id, ...updated })
    });
  };

  const handlePrivacy = (type) => {
    const newVal = privacy === type ? null : type;
    setPrivacy(newVal);
    handleUpdate("privacy_filter", newVal);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    if (val === "inactive") {
      handleUpdate("status", "inactive");
      handleUpdate("status_expires_at", null);
    }
  };

  const handleSetActive = () => {
    const expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
    handleUpdate("status", "active");
    handleUpdate("status_expires_at", expiresAt);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p className="text-xl animate-pulse">Загрузка профиля...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Твоя анкета</h1>

      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="Фото профиля"
          className="mb-4 w-32 h-32 object-cover rounded-full border border-gray-700"
        />
      )}

      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
        <p><span className="text-zinc-400">Имя:</span> {user.name}</p>
        <p><span className="text-zinc-400">Адрес:</span> {user.address}</p>
        <p><span className="text-zinc-400">Возраст:</span> {user.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {user.interests}</p>

        <div>
          <label className="text-zinc-400 block mb-1">Цель встречи</label>
          <select value={goal} onChange={(e) => { setGoal(e.target.value); handleUpdate("activity", e.target.value); }}
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2">
            <option value="">Выбери цель</option>
            <option value="Кофе">Кофе</option>
            <option value="Прогулка">Прогулка</option>
            <option value="Покурить">Покурить</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-400 block mb-1">Микро-настроение</label>
          <select value={vibe} onChange={(e) => { setVibe(e.target.value); handleUpdate("vibe", e.target.value); }}
            className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2">
            <option value="">Выбери настроение</option>
            <option value="Просто пройтись">Просто пройтись</option>
            <option value="Поговорить">Поговорить</option>
            <option value="Хочу активности">Хочу активности</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-400 block mb-2">Конфиденциальность</label>
          <div className="flex gap-2">
            <button onClick={() => handlePrivacy("online")} className={`flex-1 py-2 rounded-xl ${privacy === "online" ? "bg-green-600" : "bg-zinc-800"}`}>Только онлайн</button>
            <button onClick={() => handlePrivacy("local")} className={`flex-1 py-2 rounded-xl ${privacy === "local" ? "bg-green-600" : "bg-zinc-800"}`}>Только в районе</button>
          </div>
        </div>

        <div>
          <label className="text-zinc-400 block mb-2">Статус</label>
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2">
            <option value="inactive">Гуляю один(-а)</option>
            <option value="active">Иду гулять</option>
          </select>
          {status === "active" && (
            <div className="mt-3">
              <label className="text-sm">На сколько?</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 mt-1">
                <option value="1">1 час</option>
                <option value="2">2 часа</option>
                <option value="3">3 часа</option>
              </select>
              <button onClick={handleSetActive} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl">
                Подтвердить статус
              </button>
            </div>
          )}
        </div>

        {status === "active" && (
          <button onClick={() => window.location.href = "/people"}
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 text-white font-bold rounded-xl">
            🔎 Найти собеседника
          </button>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="mt-6 text-sm text-center bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl">
          📝 Заполнить заново
        </button>
      </div>
    </div>
  );
};

export default Profile;
