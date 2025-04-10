import { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [activity, setActivity] = useState("coffee");
  const [vibe, setVibe] = useState("walk");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = () => {
    const formData = {
      name,
      location,
      age,
      interests,
      activity,
      vibe,
      photo: photo ? photo.name : null,
    };

    window.Telegram.WebApp.sendData(JSON.stringify(formData));
    window.Telegram.WebApp.close();
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
        placeholder="Район / Город"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
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
        <option value="coffee">Кофе</option>
        <option value="walk">Прогулка</option>
        <option value="smoke">Покурить</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">Микро-настроение</label>
      <select
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        className="w-full mb-3 p-3 rounded-xl border border-gray-300"
      >
        <option value="walk">Просто пройтись</option>
        <option value="talk">Поговорить</option>
        <option value="active">Хочу активности</option>
      </select>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Фото профиля 
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
