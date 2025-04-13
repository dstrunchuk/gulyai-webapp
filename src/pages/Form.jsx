import { useState, useEffect } from "react";
import heic2any from "heic2any";

const Form = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [fade, setFade] = useState(false);
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

    const timer = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timer);
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("age", age);
    formData.append("interests", interests);
    formData.append("activity", activity);
    formData.append("vibe", vibe);
    formData.append("chat_id", chatId);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await fetch("https://gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        body: formData,
      });

      localStorage.setItem("user", JSON.stringify({
        name,
        address,
        age,
        interests,
        activity,
        vibe,
        photo: photo ? URL.createObjectURL(photo) : null,
      }));

      window.location.href = "/profile";
    } catch (err) {
      alert("❌ Ошибка отправки анкеты.");
      console.error(err);
    }
  };

  if (showIntro) {
    return (
      <div className={`transition-all duration-700 ease-in-out transform ${
        fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } flex flex-col items-center justify-center h-screen text-center px-6 bg-white`}>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Мы не публикуем анкеты</h1>
        <p className="text-gray-600 mb-2">Никто не увидит тебя, если ты не хочешь</p>
        <p className="text-gray-600 mb-8">Ты сам выбираешь, с кем говорить</p>
        <button
          onClick={() => setShowIntro(false)}
          className="bg-green-600 text-white px-8 py-3 rounded-2xl shadow-xl font-semibold hover:bg-green-700 transition"
        >
          Далее
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Заполни анкету</h1>

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
      />

      <input
        type="text"
        placeholder="Адрес (город, район, улица)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
      />

      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
      />

      <textarea
        placeholder="Интересы"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">Цель встречи</label>
      <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="w-full mb-4 p-3 rounded-xl border border-gray-300"
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
        className="w-full mb-4 p-3 rounded-xl border border-gray-300"
      >
        <option value="">Выбери настроение</option>
        <option value="Просто пройтись">Просто пройтись</option>
        <option value="Поговорить">Поговорить</option>
        <option value="Хочу активности">Хочу активности</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">Фото профиля (необязательно)</label>
      <input
        type="file"
        accept="image/*,.heic"
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
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
      >
        🚀 ГУЛЯТЬ
      </button>
    </div>
  );
};

export default Form;