import { useState, useEffect } from "react";
import heic2any from "heic2any";
import { motion } from "framer-motion";

const Form = () => {
  const [showIntro, setShowIntro] = useState(true);
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
    tg.ready();
    const interval = setInterval(() => {
      if (tg?.initDataUnsafe?.user?.id) {
        setChatId(tg.initDataUnsafe.user.id);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const convertToJpeg = async (file) => {
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
      return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
    }
    return file;
  };

  const handlePhotoChange = async (e) => {
    const selectedFile = e.target.files[0];
    const converted = await convertToJpeg(selectedFile);
    setPhoto(converted);
  };

  const handleSubmit = async () => {
    if (!chatId) {
      alert("Telegram ID ещё не загружен. Попробуйте через пару секунд.");
      return;
    }

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
      const response = await fetch("https://gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const profileData = Object.fromEntries(formData.entries());
      profileData.photo_url = result.photo_url;

      localStorage.setItem("user", JSON.stringify(profileData));
      window.location.href = "/profile";
    } catch (err) {
      alert("❌ Ошибка отправки анкеты.");
      console.error(err);
    }
  };

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#1c1c1e] text-white"
      >
        <h1 className="text-3xl font-bold mb-6">Перед тем как начать</h1>
        <ul className="text-lg space-y-3 text-center">
          <li>Мы не публикуем анкеты</li>
          <li>Никто не увидит тебя, если ты не хочешь</li>
          <li>Ты сам выбираешь, с кем говорить</li>
        </ul>
        <button
          onClick={() => setShowIntro(false)}
          className="mt-8 bg-white text-black font-bold py-2 px-6 rounded-xl hover:bg-gray-200"
        >
          Далее
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-[#1c1c1e] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Заполни анкету</h1>

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      />

      <input
        type="text"
        placeholder="Адрес (город, район, улица)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      />

      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      />

      <textarea
        placeholder="Интересы"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      />

      <label className="block text-sm mb-1">Цель встречи</label>
      <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      >
        <option value="">Выбери цель</option>
        <option value="Кофе">Кофе</option>
        <option value="Прогулка">Прогулка</option>
        <option value="Покурить">Покурить</option>
      </select>

      <label className="block text-sm mb-1">Микро-настроение</label>
      <select
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-600 bg-[#2c2c2e]"
      >
        <option value="">Выбери настроение</option>
        <option value="Просто пройтись">Просто пройтись</option>
        <option value="Поговорить">Поговорить</option>
        <option value="Хочу активности">Хочу активности</option>
      </select>

      <label className="block text-sm mb-1">Фото профиля</label>
      <input
        type="file"
        accept="image/*,.heic"
        onChange={handlePhotoChange}
        className="mb-4 w-full text-white file:bg-gray-700 file:text-white file:rounded-xl file:px-4 file:py-2 border border-gray-600 bg-[#2c2c2e]"
      />
      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="Фото"
          className="mb-4 w-32 h-32 object-cover rounded-xl border border-gray-700"
        />
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-300 transition"
      >
        🚀 ГУЛЯТЬ
      </button>
    </div>
  );
};

export default Form;
