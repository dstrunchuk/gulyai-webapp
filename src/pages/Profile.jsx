import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add("dark"); // Включаем тёмную тему
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

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
          className="w-40 h-40 object-cover rounded-2xl border mb-6 shadow-lg"
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
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold transition">
          Сменить цель
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold transition">
          Сменить статус
        </button>
        <button
          onClick={() => window.location.href = "/people"}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
        >
          Смотреть людей рядом
        </button>
      </div>
    </div>
  );
};

export default Profile;