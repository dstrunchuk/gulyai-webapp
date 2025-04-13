import { useState, useEffect } from "react";
import heic2any from "heic2any";
import { motion } from "framer-motion";

const Form = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [idLoading, setIdLoading] = useState(true);
  const [idFailed, setIdFailed] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("");
  const [vibe, setVibe] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();

    const checkUserId = () => {
      const id = tg?.initDataUnsafe?.user?.id;
      if (id) {
        setChatId(id);
        setIdLoading(false);
        clearInterval(interval);
        clearTimeout(timeout);
      }
    };

    const interval = setInterval(checkUserId, 500);
    const timeout = setTimeout(() => {
      setIdFailed(true);
      setIdLoading(false);
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
    if (!chatId) return;

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
      alert("\u274C \u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438 \u0430\u043d\u043a\u0435\u0442\u044b.");
      console.error(err);
    }
  };

  if (showIntro) {
    return (
      <motion.div className="min-h-screen flex flex-col justify-center items-center px-6 bg-black text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold mb-6">Перед тем как начать</h1>
        <ul className="text-lg space-y-3 text-center">
          <li>Мы не публикуем анкеты</li>
          <li>Никто не увидит тебя, если ты не хочешь</li>
          <li>Ты сам выбираешь, с кем говорить</li>
        </ul>
        <button onClick={() => setShowIntro(false)} className="mt-8 bg-white text-black font-bold py-2 px-6 rounded-xl hover:bg-gray-200">
          Далее
        </button>
      </motion.div>
    );
  }

  if (idLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center">
        <p className="text-lg">⏳ Загружаем Telegram ID...</p>
        <p className="text-sm text-gray-400 mt-2">Если не загружается — перезапусти WebApp</p>
      </div>
    );
  }

  if (idFailed) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center">
        <p className="text-xl mb-4">⚠️ Не удалось загрузить Telegram ID</p>
        <p className="text-sm text-gray-400 mb-6">Пожалуйста, закрой и открой мини-приложение заново через Telegram</p>
        <button className="bg-white text-black px-6 py-2 rounded-xl" onClick={() => window.Telegram?.WebApp?.close()}>Закрыть</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-[#1c1c1e] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Заполни анкету</h1>
      {/* inputs here */}
      {/* ... те же поля name, address, age, interests, activity, vibe, photo и кнопка ... */}
    </div>
  );
};

export default Form;
