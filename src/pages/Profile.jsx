import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [statusDuration, setStatusDuration] = useState(1);
  const [now, setNow] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setStatusDuration(parsed.status_duration || 1);
    }

    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.online_until) return;
    if (now > user.online_until && user.status === "online") {
      updateUser({ status: "offline", online_until: null });
    }
  }, [now]);

  const updateUser = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    await fetch("https://gulyai-backend-production.up.railway.app/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: updated.chat_id, ...updates })
    });
  };

  const resetProfile = () => {
    localStorage.removeItem("user");
    navigate("/?reset=true"); // передаём флаг
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl animate-pulse">Загрузка профиля...</p>
      </div>
    );
  }

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
          <label className="text-zinc-400">Цель встречи:</label>
          <select
            value={user.activity}
            onChange={(e) => updateUser({ activity: e.target.value })}
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="Кофе">Кофе</option>
            <option value="Прогулка">Прогулка</option>
            <option value="Покурить">Покурить</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-400">Микро-настроение:</label>
          <select
            value={user.vibe}
            onChange={(e) => updateUser({ vibe: e.target.value })}
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="Просто пройтись">Просто пройтись</option>
            <option value="Поговорить">Поговорить</option>
            <option value="Хочу активности">Хочу активности</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-400">Статус:</label>
          <select
            value={user.status || ""}
            onChange={(e) => updateUser({ status: e.target.value })}
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="">—</option>
            <option value="online">Иду гулять</option>
            <option value="offline">Гуляю один(-а)</option>
          </select>
        </div>

        {user.status === "online" && (
          <div>
            <label className="text-zinc-400">На сколько времени:</label>
            <select
              value={statusDuration}
              onChange={(e) => setStatusDuration(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
            >
              <option value={1}>1 час</option>
              <option value={2}>2 часа</option>
              <option value={3}>3 часа</option>
            </select>
            <button
              onClick={() => {
                const until = Date.now() + statusDuration * 60 * 60 * 1000;
                updateUser({
                  online_until: until,
                  status_duration: statusDuration
                });

                const label = `${statusDuration} ${statusDuration === 1 ? "час" : "часа"}`;
                setStatusMessage(`Статус подтверждён на ${label}`);
                setTimeout(() => setStatusMessage(""), 4000);
              }}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 py-2 rounded-xl font-bold transition"
            >
              Подтвердить статус
            </button>

            {statusMessage && (
              <p className="mt-2 text-green-400 text-sm text-center animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
        )}

        <div className="mt-4">
          <label className="text-zinc-400">Конфиденциальность:</label>
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => updateUser({ privacy: "nearby" })}
              className={`w-full py-2 rounded-xl font-semibold border ${
                user.privacy === "nearby"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              Онлайн для тех кто рядом
            </button>
            <button
              onClick={() => updateUser({ privacy: "district" })}
              className={`w-full py-2 rounded-xl font-semibold border ${
                user.privacy === "district"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              Онлайн для своего района
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => navigate("/people")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
        >
          Найти собеседника
        </button>

        <button
          onClick={resetProfile}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-semibold border border-zinc-700 transition"
        >
          📝 Заполнить заново
        </button>
      </div>
    </div>
  );
};

export default Profile;