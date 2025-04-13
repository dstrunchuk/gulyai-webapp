import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  if (!user) {
    return <div className="text-center text-gray-500 p-8">Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Мой профиль</h1>

        {user.photo && (
          <img
            src={user.photo}
            alt="Фото"
            className="mx-auto mb-6 w-32 h-32 object-cover rounded-full border border-gray-300 shadow-md"
          />
        )}

        <div className="space-y-4 text-gray-700">
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Адрес:</strong> {user.address}</p>
          <p><strong>Возраст:</strong> {user.age}</p>
          <p><strong>Интересы:</strong> {user.interests}</p>
          <p><strong>Цель встречи:</strong> {user.activity}</p>
          <p><strong>Микро-настроение:</strong> {user.vibe}</p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition">
            Сменить цель
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition">
            Сменить статус
          </button>
        </div>

        <div className="mt-10 text-center">
          <button className="bg-green-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:bg-green-700 transition">
            Смотреть людей рядом
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
