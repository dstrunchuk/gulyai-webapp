import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = "https://gulyai-backend-production.up.railway.app";

const ViewProfile = () => {
  const { chat_id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile/${chat_id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Ошибка при загрузке анкеты:", err);
      }
    };
    fetchProfile();
  }, [chat_id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl animate-pulse">Загрузка анкеты...</p>
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

      <div className="w-full max-w-md bg-gradient-to-br from-[#2c2c2e] to-[#1f1f20] p-6 rounded-2xl shadow-2xl space-y-3">
        <p><span className="text-zinc-400">Имя:</span> {user.name}</p>
        <p><span className="text-zinc-400">Адрес:</span> {user.address}</p>
        <p><span className="text-zinc-400">Возраст:</span> {user.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {user.interests}</p>
        <p><span className="text-zinc-400">Цель встречи:</span> {user.activity}</p>
        <p><span className="text-zinc-400">Микро-настроение:</span> {user.vibe}</p>
        <p><span className="text-zinc-400">Статус:</span> {user.status === "online" ? "Иду гулять" : "Гуляю один"}</p>
      </div>
    </div>
  );
};

export default ViewProfile;