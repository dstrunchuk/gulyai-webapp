import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user) return <p className="p-4">Загрузка профиля...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=profile"
            alt="Аватар"
            className="w-32 h-32 rounded-full border"
          />
        </div>
        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-gray-600 mb-3 text-sm">{user.address}, {user.age} лет</p>

        <div className="text-left space-y-2 text-sm">
          <p><strong>🎯 Цель встречи:</strong> {user.activity || "—"}</p>
          <p><strong>💬 Настроение:</strong> {user.vibe || "—"}</p>
          <p><strong>🔥 Интересы:</strong> {user.interests || "—"}</p>
        </div>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          👥 Смотреть людей рядом
        </button>
      </div>
    </div>
  );
};

export default Profile;
