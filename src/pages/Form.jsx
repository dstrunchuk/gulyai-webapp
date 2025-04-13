import { useState, useEffect } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("");
  const [vibe, setVibe] = useState("");
  const [photo, setPhoto] = useState(null);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setChatId(tg.initDataUnsafe.user.id);
    }
    tg.ready();
  }, []);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("age", age);
    formData.append("interests", interests);
    formData.append("activity", activity);
    formData.append("vibe", vibe);
    formData.append("chat_id", chatId);
    if (photo) formData.append("photo", photo);
  
    try {
      const res = await fetch("https://gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
      const fullUserData = {
        name,
        address,
        age,
        interests,
        activity,
        vibe,
        chat_id: chatId,
        photo_url: result.photo_url || null,
      };
  
      localStorage.setItem("user", JSON.stringify(fullUserData));
      window.location.href = "/profile";
    } catch (err) {
      console.error("Ошибка отправки анкеты:", err);
      alert("Ошибка при отправке. Попробуйте ещё раз.");
    }
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
      <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      >
        <option value="">Цель встречи</option>
        <option value="Кофе">Кофе</option>
        <option value="Прогулка">Прогулка</option>
        <option value="Покурить">Покурить</option>
      </select>
      <select
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      >
        <option value="">Микро-настроение</option>
        <option value="Просто пройтись">Просто пройтись</option>
        <option value="Поговорить">Поговорить</option>
        <option value="Хочу активности">Хочу активности</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
      >
        🚀 ГУЛЯТЬ
      </button>
    </div>
  );
};

export default Form;
