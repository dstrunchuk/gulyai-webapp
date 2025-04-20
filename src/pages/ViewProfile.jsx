import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = "https://gulyai-backend-production.up.railway.app";

const ViewProfile = () => {
  const { chat_id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!chat_id) return;

    fetch(`${BACKEND_URL}/api/profile/${chat_id}`)
      .then(res => res.json())
      .then(setProfile)
      .catch(err => console.error("Ошибка при загрузке профиля:", err));
  }, [chat_id]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl animate-pulse">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 py-8 flex flex-col items-center">
      {profile.photo_url && (
        <img
          src={profile.photo_url}
          alt="Фото профиля"
          className="mb-6 w-36 h-36 object-cover rounded-full border-4 border-[#2c2c2e] shadow-lg"
        />
      )}

      <div className="w-full max-w-md bg-gradient-to-br from-[#2c2c2e] to-[#1f1f20] p-6 rounded-2xl shadow-2xl space-y-2">
        <p><span className="text-zinc-400">Имя:</span> {profile.name}</p>
        <p><span className="text-zinc-400">Адрес:</span> {profile.address}</p>
        <p><span className="text-zinc-400">Возраст:</span> {profile.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {profile.interests}</p>
        <p><span className="text-zinc-400">Цель встречи:</span> {profile.activity}</p>
        <p><span className="text-zinc-400">Настроение:</span> {profile.vibe}</p>
        <p><span className="text-zinc-400">Статус:</span> {profile.status === "online" ? "Хочет встретиться" : "Гуляет один"}</p>
      </div>
    </div>
  );
};

export default ViewProfile;