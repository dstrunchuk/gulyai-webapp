// Upgraded Profile.jsx with status & privacy
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("гуляю один");
  const [onlineUntil, setOnlineUntil] = useState(null);
  const [privacyOnlineOnly, setPrivacyOnlineOnly] = useState(false);
  const [privacySameDistrict, setPrivacySameDistrict] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setStatus(parsed.status || "гуляю один");
      setOnlineUntil(parsed.online_until || null);
      setPrivacyOnlineOnly(parsed.privacy_online_only || false);
      setPrivacySameDistrict(parsed.privacy_same_district || false);
    }
  }, []);

  const updateStatus = async (newStatus, duration = null) => {
    const until = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null;
    const updates = {
      status: newStatus,
      online_until: until?.toISOString() || null,
    };
    await fetch("https://gulyai-backend-production.up.railway.app/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: user.chat_id, ...updates }),
    });
    localStorage.setItem("user", JSON.stringify({ ...user, ...updates }));
    setStatus(newStatus);
    setOnlineUntil(until?.toISOString() || null);
  };

  const updatePrivacy = async (field, value) => {
    const updates = {
      [field]: value,
    };
    await fetch("https://gulyai-backend-production.up.railway.app/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: user.chat_id, ...updates }),
    });
    localStorage.setItem("user", JSON.stringify({ ...user, ...updates }));
    field === "privacy_online_only" ? setPrivacyOnlineOnly(value) : setPrivacySameDistrict(value);
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
          src={user?.photo_url}
          alt="Фото профиля"
          className="mb-4 w-32 h-32 object-cover rounded-full border border-gray-700"
        />
      )}

      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
        <p><span className="text-zinc-400">Имя:</span> {user.name}</p>
        <p><span className="text-zinc-400">Адрес:</span> {user.address}</p>
        <p><span className="text-zinc-400">Возраст:</span> {user.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {user.interests}</p>
        <p><span className="text-zinc-400">Цель:</span> {user.activity}</p>
        <p><span className="text-zinc-400">Настроение:</span> {user.vibe}</p>

        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={privacyOnlineOnly} onChange={e => updatePrivacy("privacy_online_only", e.target.checked)} />
            Показывать только тем, кто онлайн
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={privacySameDistrict} onChange={e => updatePrivacy("privacy_same_district", e.target.checked)} />
            Только в своём районе
          </label>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm text-gray-400">Статус:</p>
          {status === "гуляю один" ? (
            <div className="space-x-2">
              {[1, 2, 3].map(hr => (
                <button key={hr} onClick={() => updateStatus("иду гулять", hr)} className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-xl">
                  {hr} ч
                </button>
              ))}
            </div>
          ) : (
            <button onClick={() => updateStatus("гуляю один")} className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-xl">
              Я больше не гуляю
            </button>
          )}
        </div>

        {status === "иду гулять" && (
          <button
            onClick={() => window.location.href = "/people"}
            className="w-full bg-white text-black mt-4 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            🔎 Смотреть людей рядом
          </button>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="underline text-sm text-gray-300 hover:text-white"
        >
          📝 Заполнить заново
        </button>
      </div>
    </div>
  );
};

export default Profile;
