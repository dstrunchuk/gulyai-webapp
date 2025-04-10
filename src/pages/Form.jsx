import { useEffect, useState } from "react";
import { useTelegram } from "../hooks/useTelegram";

export default function Form() {
  const { tg } = useTelegram();
  const [form, setForm] = useState({
    name: "",
    district: "",
    age: "",
    interests: "",
    activity: "",
    mood: "",
    status: "ready", // фиксировано
    photo: null,
    latitude: null,
    longitude: null,
  });

  // Получение геолокации
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => {
        console.warn("Геолокация не разрешена", err);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    const timestamp = Date.now(); // отметка времени для "Гуляю"

    const reader = new FileReader();
    reader.onloadend = () => {
      const payload = {
        ...form,
        timestamp,
        photo_url: reader.result, // base64
      };
      tg.sendData(JSON.stringify(payload));
    };

    if (form.photo) {
      reader.readAsDataURL(form.photo);
    } else {
      tg.sendData(JSON.stringify({ ...form, timestamp }));
    }
  };

  return (
    <div className="p-4 space-y-3 text-left">
      <h2 className="text-2xl font-bold">Заполни анкету</h2>

      <input name="name" placeholder="Имя" className="input" onChange={handleChange} />
      <input name="district" placeholder="Район / Город" className="input" onChange={handleChange} />
      <input name="age" type="number" placeholder="Возраст" className="input" onChange={handleChange} />
      <textarea name="interests" placeholder="Интересы" className="input" onChange={handleChange} />

      <select name="activity" className="input" onChange={handleChange}>
        <option value="">Цель встречи</option>
        <option value="coffee">Кофе</option>
        <option value="walk">Прогуляться</option>
        <option value="smoke">Покурить</option>
      </select>

      <select name="mood" className="input" onChange={handleChange}>
        <option value="">Микро-настроение</option>
        <option value="talk">Поговорить</option>
        <option value="chill">Просто пройтись</option>
        <option value="active">Хочу активности</option>
      </select>

      <input type="file" name="photo" accept="image/*" className="input" onChange={handleChange} />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white w-full py-2 rounded font-semibold mt-4"
      >
        ГУЛЯТЬ
      </button>
    </div>
  );
}
