import { useState, useEffect } from "react";
import heic2any from "heic2any";

const Form = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    age: "",
    interests: "",
    activity: "",
    vibe: "",
    chat_id: null,
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setForm((prev) => ({ ...prev, chat_id: tg.initDataUnsafe.user.id }));
    }
    tg.ready();
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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    const formData = { ...form };
    if (photo) {
      formData.photo = await toBase64(photo);
    }

    try {
      await fetch("https://gulyai-backend-production.up.railway.app/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      localStorage.setItem("user", JSON.stringify(formData));
      window.location.href = "/profile";
    } catch (err) {
      alert("❌ Ошибка отправки анкеты");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Заполни анкету</h1>

      <input type="text" placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300" />
      <input type="text" placeholder="Адрес" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300" />
      <input type="number" placeholder="Возраст" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300" />
      <textarea placeholder="Интересы" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300" />

      <label className="block text-sm font-medium text-gray-700 mb-1">Цель встречи</label>
      <select value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300">
        <option value="">Выбери цель</option>
        <option value="Кофе">Кофе</option>
        <option value="Прогулка">Прогулка</option>
        <option value="Покурить">Покурить</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">Микро-настроение</label>
      <select value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} className="w-full mb-3 p-3 rounded-xl border border-gray-300">
        <option value="">Выбери настроение</option>
        <option value="Просто пройтись">Просто пройтись</option>
        <option value="Поговорить">Поговорить</option>
        <option value="Хочу активности">Хочу активности</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">Фото профиля (необязательно)</label>
      <input type="file" accept="image/*,.heic" onChange={handlePhotoChange} className="mb-4 w-full border border-gray-300 rounded-xl p-2 bg-white shadow-sm" />
      {photo && <img src={URL.createObjectURL(photo)} alt="Фото" className="mb-4 w-32 h-32 object-cover rounded-xl border" />}

      <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">🚀 ГУЛЯТЬ</button>
    </div>
  );
};

export default Form;
