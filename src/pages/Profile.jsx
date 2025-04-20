import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [statusDuration, setStatusDuration] = useState(1);
  const [now, setNow] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const externalChatId = queryParams.get("chat_id");

  useEffect(() => {
    const stored = localStorage.getItem("user");

    // Если есть внешний chat_id — загружаем анкету этого пользователя
    if (externalChatId) {
      fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${externalChatId}`)
        .then(res => res.json())
        .then(setUser)
        .catch(err => console.error("❌ Ошибка при получении анкеты:", err));
      return;
    }

    // Иначе загружаем свою анкету
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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

  const handleUpdateAddress = () => {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
  
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        const { city, town, village, road, state, suburb, city_district } = data.address;
        const area = suburb || city_district || "";
        const fullAddress = `${city || town || village || ""}${area ? `, ${area}` : ""}${road ? `, ${road}` : ""}${state ? `, ${state}` : ""}`;
  
        // Отправка обновлённого адреса в Supabase
        const response = await fetch("https://gulyai-backend-production.up.railway.app/api/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: user.chat_id,
            address: fullAddress,
            latitude: lat,
            longitude: lon
          }),
        });
  
        if (!response.ok) throw new Error("Ошибка при обновлении");
  
        // Обновляем localStorage и state
        const updated = { ...user, address: fullAddress, latitude: lat, longitude: lon };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
  
        alert("✅ Адрес обновлён!");
      } catch (err) {
        console.error("Ошибка при обновлении адреса:", err);
        alert("❌ Не удалось обновить адрес.");
      }
    }, (err) => {
      console.error("Геолокация не получена:", err);
      alert("❌ Не удалось получить геолокацию.");
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl animate-pulse">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 py-8 flex flex-col items-center">
      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="Фото профиля"
          className="mb-6 w-36 h-36 object-cover rounded-full border-4 border-[#2c2c2e] shadow-lg"
        />
      )}
  
      <div className="w-full max-w-md bg-gradient-to-br from-[#2c2c2e] to-[#1f1f20] p-6 rounded-2xl shadow-2xl space-y-2">
        <p><span className="text-zinc-400">Имя:</span> {user.name}</p>
  
        <div className="flex items-start justify-between gap-2">
          <p className="flex-1 break-words"><span className="text-zinc-400">Адрес:</span> {user.address}</p>
          <button
            onClick={handleUpdateAddress}
            className="ml-3 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md hover:opacity-90 transition"
          >
            Обновить
          </button>
        </div>
  
        <p><span className="text-zinc-400">Возраст:</span> {user.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {user.interests}</p>
  
        <div>
          <label className="text-zinc-400">Цель встречи:</label>
          <select
            value={user.activity}
            onChange={(e) => updateUser({ activity: e.target.value })}
            className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="Просто пройтись">Просто пройтись</option>
            <option value="Поговорить">Поговорить</option>
            <option value="Хочу активности">Хочу активности</option>
          </select>
        </div>
  
        <div id="status-block">
          <label className="text-zinc-400">Статус:</label>
          <select
            value={user.status || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "offline") {
                updateUser({
                  status: "offline",
                  online_until: null,
                  status_duration: null
                });
              } else {
                updateUser({ status: value });
              }
            }}
            className="w-full mt-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          >
            <option value="">—</option>
            <option value="online">Иду гулять</option>
            <option value="offline">Гуляю один(-а)</option>
          </select>
        </div>
  
        {user.status === "online" && (
          <div className="mt-4">
            <label className="text-zinc-400">На сколько времени:</label>
            <select
              value={statusDuration}
              onChange={(e) => setStatusDuration(Number(e.target.value))}
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700"
            >
              <option value={1}>1 час</option>
              <option value={2}>2 часа</option>
              <option value={3}>3 часа</option>
            </select>
  
            <button
              onClick={async () => {
                const until = Date.now() + statusDuration * 60 * 60 * 1000;
  
                const updates = {
                  status: "online",
                  online_until: until,
                  status_duration: statusDuration
                };
  
                await updateUser(updates);
  
                const label = `${statusDuration} ${statusDuration === 1 ? "час" : "часа"}`;
                setStatusMessage(`Статус подтверждён на ${label}`);
                setTimeout(() => setStatusMessage(""), 4000);
              }}
              className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 py-3 rounded-xl font-bold transition"
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
      </div>
  
      <div className="mt-10 flex flex-col gap-4 w-full max-w-md">
        {user.status === "online" ? (
          <button
            onClick={() => navigate("/people")}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white py-3 rounded-xl font-bold transition"
          >
            🚀 Гулять
          </button>
        ) : (
          <div className="text-center">
            <button
              onClick={() => {
                const block = document.getElementById("status-block");
                if (block) block.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3 rounded-xl font-bold bg-gray-700 text-gray-400 cursor-not-allowed"
            >
              🚶 Включи статус, чтобы гулять
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Поставь статус “Иду гулять”, чтобы открыть список
            </p>
          </div>
        )}
  
        <button
          onClick={resetProfile}
          className="w-full bg-[#2c2c2e] hover:bg-[#3c3c3e] text-white py-3 rounded-xl font-semibold border border-zinc-700 transition"
        >
          📝 Заполнить заново
        </button>
      </div>
    </div>
  );
};

export default Profile;