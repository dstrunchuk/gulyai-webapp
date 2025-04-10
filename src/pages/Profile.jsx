import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Здесь будет реальный fetch на бэкенд (пока заглушка)
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleChangeGoal = () => {
    alert("Заменить цель (в будущем модалка или переход)");
  };

  const handleChangeMood = () => {
    alert("Сменить микро-настроение");
  };

  const handleStatus = () => {
    alert("Сменить статус на 'Готов гулять'");
  };

  const handleSeePeople = () => {
    alert("Показать людей рядом (будет переход)");
  };

  if (!user) return <p className="p-4">Загрузка профиля...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Мой профиль</h1>

      {user.photo && (
        <img
          src={user.photo_url}
          alt="Фото"
          className="w-32 h-32 object-cover rounded-xl border"
        />
      )}

      <div className="space-y-1 text-sm">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Адрес:</strong> {user.address}</p>
        <p><strong>Возраст:</strong> {user.age}</p>
        <p><strong>Интересы:</strong> {user.interests}</p>
        <p><strong>Цель:</strong> {user.activity}</p>
        <p><strong>Настроение:</strong> {user.vibe}</p>
      </div>

      <button onClick={handleChangeGoal} className="btn">✏️ Сменить цель</button>
      <button onClick={handleChangeMood} className="btn">🎭 Сменить настроение</button>
      <button onClick={handleStatus} className="btn">🟢 Я хочу гулять</button>
      <button onClick={handleSeePeople} className="btn bg-blue-600 text-white">🔍 Смотреть людей рядом</button>
    </div>
  );
}
