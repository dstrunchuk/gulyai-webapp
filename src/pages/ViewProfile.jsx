import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ViewProfile = () => {
  const { chat_id } = useParams(); // получаем chat_id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${chat_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении анкеты:", err);
        setLoading(false);
      });
  }, [chat_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] text-white flex items-center justify-center">
        <p>Загрузка анкеты...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] text-white flex items-center justify-center">
        <p>Анкета не найдена</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white px-4 py-8 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="self-start text-white mb-4 hover:opacity-80 transition"
      >
        ← Назад
      </button>

      {profile.photo_url && (
        <img
          src={profile.photo_url}
          alt="Фото профиля"
          className="mb-6 w-36 h-36 object-cover rounded-full border-4 border-[#2c2c2e] shadow-lg"
        />
      )}

      <div className="w-full max-w-md bg-gradient-to-br from-[#2c2c2e] to-[#1f1f20] p-6 rounded-2xl shadow-2xl space-y-3">
        <p><span className="text-zinc-400">Имя:</span> {profile.name}</p>
        <p><span className="text-zinc-400">Адрес:</span> {profile.address}</p>
        <p><span className="text-zinc-400">Возраст:</span> {profile.age}</p>
        <p><span className="text-zinc-400">Интересы:</span> {profile.interests}</p>
        <p><span className="text-zinc-400">Цель:</span> {profile.activity}</p>
        <p><span className="text-zinc-400">Настроение:</span> {profile.vibe}</p>
      </div>
    </div>
  );
};

export default ViewProfile;