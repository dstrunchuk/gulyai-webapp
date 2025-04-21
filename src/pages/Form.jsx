import { useState, useEffect } from "react";
import heic2any from "heic2any";
import { motion } from "framer-motion";

const Form = () => {
  const [stage, setStage] = useState("intro");
  const [checkingStorage, setCheckingStorage] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("");
  const [vibe, setVibe] = useState("");
  const [photo, setPhoto] = useState(null);

  console.log("Текущий stage:", stage);
  console.log("checkingStorage:", checkingStorage);


  useEffect(() => {
    if (stage === "intro" && checkingStorage) {
      console.log("На экране intro слишком долго — сбрасываем checkingStorage");
      setCheckingStorage(false);
    }
  }, [stage, checkingStorage]);

  // Получаем геолокацию
  useEffect(() => {
    if (stage !== "loading") return;
  
    const tg = window.Telegram?.WebApp;
    tg?.ready();
  
    const id = tg?.initDataUnsafe?.user?.id;
    console.log("Получен Telegram ID:", id);
  
    if (!id) {
      console.warn("Telegram ID не получен. Переход в failed через 5 сек...");
      const timeout = setTimeout(() => setStage("failed"), 1000);
      return () => clearTimeout(timeout);
    }
  
    setChatId(id);
  
    const params = new URLSearchParams(window.location.search);
    const isReset = params.get("reset") === "true";
  
    // Получаем геолокацию и подставляем адрес
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
  
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await res.json();
            const { city, town, village, road, state, suburb, city_district } = data.address;
            const area = suburb || city_district || "";
            const fullAddress = `${city || town || village || ""}, ${area}, ${road || ""}, ${state || ""}`;
            setAddress(fullAddress);
          } catch (err) {
            console.warn("Ошибка при получении адреса:", err);
          }
        },
        (err) => {
          console.error("Ошибка при получении геолокации:", err);
        }
      );
    }
  
    // Если reset=1, то открываем форму заново
    if (isReset) {
      console.log("Режим reset — открываем форму");
      setStage("form");
      setCheckingStorage(false);
      return;
    }
  
    // Проверка анкеты
    setTimeout(() => {
      fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Анкета не найдена");
          return res.json();
        })
        .then((profile) => {
          localStorage.setItem("user", JSON.stringify(profile));
          window.location.href = "/profile";
        })
        .catch((err) => {
          console.warn("Анкета не найдена:", err.message);
          setStage("form");
          setCheckingStorage(false);
        });
    }, 1000); // даём 1 секунду геолокации и адресу
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
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
  
    if (!telegramUser.username) {
      window.Telegram.WebApp.showPopup({
        title: "Username не найден",
        message:
          "Чтобы другие могли перейти в твой профиль, задай username в Telegram.\n\nОткрой Telegram → Настройки → Имя пользователя",
        buttons: [{ id: "cancel", type: "close", text: "Понял" }]
      });
      return;
    }
  
    if (!chatId) {
      alert("❌ Не удалось получить chat_id. Попробуй перезапустить WebApp.");
      return;
    }
  
    if (!latitude || !longitude) {
      window.Telegram.WebApp.showPopup({
        title: "Геолокация не получена",
        message: "Чтобы другие могли видеть тебя рядом, разреши доступ к геолокации.",
        buttons: [{ id: "ok", type: "close", text: "Понял" }]
      });
      return;
    }

  

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("age", age);
    formData.append("interests", interests);
    formData.append("activity", activity);
    formData.append("vibe", vibe);
    formData.append("chat_id", chatId);
    if (latitude && longitude) {
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
    }
    if (photo) formData.append("photo", photo);

    try {
      const res = await fetch("https://gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.ok) throw new Error("Ошибка с сервера");

      const profileData = {
        name,
        address,
        age,
        interests,
        activity,
        vibe,
        chat_id: chatId,
        photo_url: result.photo_url,
        latitude,
        longitude,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(profileData));
      window.location.href = "/profile";
    } catch (err) {
      alert("❌ Ошибка отправки анкеты.");
      console.error(err);
      setSubmitting(false);
    }
  };

  if (checkingStorage) return null;

  if (stage === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-[#1c1c1e] to-[#2a2a2e] text-white text-center overflow-hidden"
      >
        <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 max-w-md w-full space-y-4">
          <ul className="text-base text-left space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span> Мы не публикуем анкеты
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span> Никто не увидит тебя без твоего согласия
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span> Ты сам(-а) выбираешь, с кем говорить
            </li>
          </ul>
  
          <div className="text-sm text-gray-300 mt-4 bg-zinc-800 p-3 rounded-xl border border-zinc-700">
            Анкета хранится <strong className="text-white">30 дней</strong>, после чего автоматически удаляется,
            чтобы не перегружать сервер и базу данных.  
            <br /> Надеемся на ваше понимание.
          </div>
  
          <button
            onClick={() => setStage("loading")}
            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow hover:opacity-90 transition"
          >
            Далее
          </button>
  
          <a
            href="https://t.me/gulyai_help"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block w-full max-w-md bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-center py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            Канал поддержки Gulyai
          </a>
  
          <p className="mt-2 text-sm text-zinc-400 text-center max-w-md">
            Подпишись, чтобы быть в курсе обновлений, задать вопрос или предложить идею.
          </p>
        </div>
      </motion.div>
    );
  }
  
  if (stage === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-[#1c1c1e] to-[#2a2a2e] text-white text-center overflow-hidden"
      >
        <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 max-w-md w-full space-y-4">
          <p className="text-xl font-medium">⏳ Загружаем Telegram ID...</p>
          <p className="text-sm text-gray-400">Если не загружается — перезапусти WebApp</p>
          <button
            onClick={() => setStage("intro")}
            className="mt-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-600 transition"
          >
            ← Назад
          </button>
        </div>
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

  if (stage === "form") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 py-6"
      >
        <div className="max-w-md mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center mb-2">Заполни анкету</h1>
  
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
          />
          <input
            type="text"
            placeholder="Адрес (город, район, улица)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
          />
          <input
            type="number"
            placeholder="Возраст"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
          />
          <textarea
            placeholder="Интересы"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
          />
  
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Цель встречи</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
            >
              <option value="">Выбери цель</option>
              <option value="Кофе">Кофе</option>
              <option value="Прогулка">Прогулка</option>
              <option value="Покурить">Покурить</option>
            </select>
          </div>
  
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Микро-настроение</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-700 bg-zinc-900"
            >
              <option value="">Выбери настроение</option>
              <option value="Просто пройтись">Просто пройтись</option>
              <option value="Поговорить">Поговорить</option>
              <option value="Хочу активности">Хочу активности</option>
            </select>
          </div>
  
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Фото профиля</label>
            <input
              type="file"
              accept="image/*,.heic"
              onChange={handlePhotoChange}
              className="w-full p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>
  
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Фото"
              className="w-32 h-32 object-cover rounded-xl border border-zinc-700 mx-auto"
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
  
          <button
            onClick={() => setStage("intro")}
            className="mt-2 bg-zinc-800 text-white py-2 rounded-xl hover:bg-zinc-700 transition"
          >
            ← Назад
          </button>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 py-6 flex flex-col items-center">
      <p>Ничего не найдено для stage: {stage}</p>
    </div>
  );
}

export default Form;