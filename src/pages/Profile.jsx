import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("offline");
  const [statusDuration, setStatusDuration] = useState(1);
  const [privacy, setPrivacy] = useState("everyone");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setStatus(parsed.status || "offline");
      setPrivacy(parsed.privacy || "everyone");
    }
  }, []);

  const updateProfile = async () => {
    if (!user) return;
    setUpdating(true);

    const expiresAt = status === "online"
      ? new Date(Date.now() + statusDuration * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from("users")
      .update({ status, privacy, status_expires_at: expiresAt })
      .eq("chat_id", user.chat_id);

    if (!error) {
      const updated = { ...user, status, privacy, status_expires_at: expiresAt };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    }
    setUpdating(false);
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
        <p><span className="text-zinc-400">Цель:</span> {user.activity}</p>
        <p><span className="text-zinc-400">Настроение:</span> {user.vibe}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-md">
        <div className="bg-zinc-800 p-4 rounded-xl">
          <p className="mb-2">Статус:</p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mb-2 p-2 rounded-lg bg-zinc-900 text-white"
          >
            <option value="offline">Гуляю один(-а)</option>
            <option value="online">Иду гулять</option>
          </select>

          {status === "online" && (
            <select
              value={statusDuration}
              onChange={(e) => setStatusDuration(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-zinc-900 text-white"
            >
              <option value={1}>На 1 час</option>
              <option value={2}>На 2 часа</option>
              <option value={3}>На 3 часа</option>
            </select>
          )}
        </div>

        <div className="bg-zinc-800 p-4 rounded-xl">
          <p className="mb-2">Конфиденциальность:</p>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full p-2 rounded-lg bg-zinc-900 text-white"
          >
            <option value="everyone">Онлайн для тех кто рядом</option>
            <option value="local">Онлайн для своего района</option>
          </select>
        </div>

        <button
          onClick={updateProfile}
          className="bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-300 transition"
          disabled={updating}
        >
          {updating ? "Сохраняем..." : "✅ Подтвердить статус"}
        </button>

        <button
          onClick={() => window.location.href = "/people"}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
        >
          Найти собеседника
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
        >
          📝 Заполнить заново
        </button>
      </div>
    </div>
  );
};

export default Profile;