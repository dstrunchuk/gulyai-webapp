import { useEffect, useState } from "react";

const People = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch("https://gulyai-backend-production.up.railway.app/api/people");
        const data = await res.json();
        setPeople(data);
      } catch (err) {
        console.error("Ошибка при загрузке людей:", err);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Люди рядом</h1>

      {people.length === 0 ? (
        <p className="text-center text-gray-500">Пока никого рядом нет...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {people.map((user, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
            >
              {user.photo_url && (
                <img
                  src={user.photo_url}
                  alt="Профиль"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{user.address}</p>
              <p className="text-sm text-gray-600 mb-1">Возраст: {user.age}</p>
              <p className="text-sm text-gray-600 mb-1">Интересы: {user.interests}</p>
              <p className="text-sm text-gray-600 mb-1">Цель: {user.activity}</p>
              <p className="text-sm text-gray-600 mb-1">Настроение: {user.vibe}</p>
              <a
                href={`https://t.me/${user.username || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-white bg-blue-600 hover:bg-blue-700 font-medium py-2 px-4 rounded-xl"
              >
                Написать в Telegram
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default People;
