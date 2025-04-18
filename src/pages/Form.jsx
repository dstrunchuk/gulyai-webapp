import { useState, useEffect } from "react";
import heic2any from "heic2any";
import { motion } from "framer-motion";

const Form = () => {
  const [stage, setStage] = useState("intro");
  const [chatId, setChatId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("");
  const [vibe, setVibe] = useState("");
  const [photo, setPhoto] = useState(null);

  // Проверка localStorage
  useEffect(() => {
    const existing = localStorage.getItem("user");
    if (existing) {
      const user = JSON.parse(existing);
      const createdAt = new Date(user.created_at);
      const daysPassed = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysPassed < 30) {
        if (30 - daysPassed <= 5) {
          alert(`⚠️ Внимание! Анкета будет удалена через ${30 - daysPassed} дней.`);
        }
        window.location.href = "/profile";
      } else {
        localStorage.removeItem("user");
      }
    }
    setCheckingStorage(false);
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    const id = tg?.initDataUnsafe?.user?.id;

    if (id) {
      setChatId(id);
      setStage("form");
    } else {
      const timeout = setTimeout(() => setStage("failed"), 5000);
      return () => clearTimeout(timeout);
    }
  }, [stage]);

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
    setSubmitting(true);
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
      const profileData = Object.fromEntries(formData.entries());
      profileData.photo_url = result.photo_url;
      localStorage.setItem("user", JSON.stringify(profileData));
      window.location.href = "/profile";
    } catch (err) {
      alert("❌ Ошибка отправки анкеты.");
      console.error(err);
      setSubmitting(false);
    }
  };

  // Пока идёт проверка localStorage
  if (checkingStorage) return null;

  if (stage === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col justify-center items-center px-6 bg-[#1c1c1e] text-white text-center"
      >
        <h1 className="text-3xl font-bold mb-6">Прежде чем начать</h1>
        <ul className="text-lg space-y-3 mb-8">
          <li>Мы не публикуем анкеты</li>
          <li>Никто не увидит тебя, если ты не хочешь</li>
          <li>Ты сам(-а) выбираешь, с кем говорить</li>
        </ul>
        <div className="bg-[#2c2c2e] p-4 rounded-xl border border-gray-600 max-w-md text-sm">
          <p>
            Анкета будет храниться <strong>30 дней</strong> с момента заполнения. После — удаляется
            автоматически, и потребуется заполнить заново. Чтобы не перегружать сервер.
          </p>
          <p className="mt-2 text-gray-400">Надеемся на понимание!</p>
        </div>
        <button
          onClick={() => setStage("loading")}
          className="mt-8 bg-white text-black font-bold py-2 px-6 rounded-xl hover:bg-gray-200"
        >
          Далее
        </button>
      </motion.div>
    );
  }

  if (stage === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col justify-center items-center px-6 bg-black text-white text-center"
      >
        <p className="text-xl mb-3">⏳ Загружаем Telegram ID...</p>
        <p className="text-sm text-gray-400 mb-6">Если не загружается — перезапусти WebApp</p>
        <button
          onClick={() => setStage("intro")}
          className="mt-2 bg-white text-black font-semibold py-2 px-6 rounded-xl hover:bg-gray-200 transition"
        >
          ← Назад
        </button>
      </motion.div>
    );
  }

  if (stage === "failed") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-6 text-center">
        <p className="text-xl mb-4">⚠️ Не удалось загрузить Telegram ID</p>
        <p className="text-sm text-gray-400 mb-6">
          Пожалуйста, закрой и открой мини-приложение заново через Telegram
        </p>
        <button
          className="bg-white text-black px-6 py-2 rounded-xl"
          onClick={() => window.Telegram?.WebApp?.close()}
        >
          Закрыть
        </button>
      </div>
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
        disabled={submitting}
        className={`w-full py-3 rounded-xl font-bold transition ${
          submitting ? "bg-gray-500 text-white" : "bg-white text-black hover:bg-gray-300"
        }`}
      >
        {submitting ? "⏳ Загрузка..." : "🚀 ГУЛЯТЬ"}
      </button>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setStage("intro")}
          className="bg-gray-700 text-white py-2 px-6 rounded-xl hover:bg-gray-600"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
};

export default Form;