import { useState, useEffect } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("");
  const [vibe, setVibe] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      // ❗ только внутри компонента
      // window.Telegram.WebApp.setClosingBehavior({ need_confirmation: true });
    }
  }, []);

  const handleSubmit = async () => {
    const formData = {
      name,
      address,
      age,
      interests,
      activity,
      vibe,
      photo: photo ? URL.createObjectURL(photo) : null,
      telegram_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null,
    };
  
    console.log("👉 Отправка анкеты:", formData);
  
    try {
      await fetch("gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("❌ Ошибка при отправке:", err);
    }
  
    localStorage.setItem("user", JSON.stringify(formData));
    window.location.href = "/profile";
  };
  

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Заполни анкету</h1>

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      />

      <input
        type="text"
        placeholder="Адрес (город, район, улица)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      />

      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      />

      <textarea
        placeholder="Интересы"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Цель встречи</label>
      <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      >
        <option value="">Выбери цель</option>
        <option value="Кофе">Кофе</option>
        <option value="Прогулка">Прогулка</option>
        <option value="Покурить">Покурить</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">Микро-настроение</label>
      <select
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      >
        <option value="">Выбери настроение</option>
        <option value="Просто пройтись">Просто пройтись</option>
        <option value="Поговорить">Поговорить</option>
        <option value="Хочу активности">Хочу активности</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Фото профиля (необязательно)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="mb-4 w-full border border-gray-300 rounded-xl p-2 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="Фото"
          className="mb-4 w-32 h-32 object-cover rounded-xl border"
        />
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
      >
        🚀 ГУЛЯТЬ
      </button>
    </div>
  );
};

export default Form;
