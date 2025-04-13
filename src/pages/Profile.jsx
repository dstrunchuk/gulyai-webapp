import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <p className="text-center mt-8">Анкета не найдена</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white text-center">
      {user.photo_url ? (
        <img
          src={user.photo_url}
          alt="Фото профиля"
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border"
        />
      ) : (
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 text-3xl">
          😊
        </div>
      )}

      <h2 className="text-2xl font-bold mb-1">{user.name || "—"}</h2>
      <p className="text-gray-500 mb-4">{user.age ? `${user.age} лет` : "Возраст не указан"}</p>

      <p className="mb-2 text-left">
        🎯 <strong>Цель встречи:</strong> {user.activity || "—"}
      </p>
      <p className="mb-2 text-left">
        💬 <strong>Настроение:</strong> {user.vibe || "—"}
      </p>
      <p className="mb-4 text-left">
        🔥 <strong>Интересы:</strong> {user.interests || "—"}
      </p>

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
        👥 Смотреть людей рядом
      </button>
    </div>
  );
};

export default Profile;
