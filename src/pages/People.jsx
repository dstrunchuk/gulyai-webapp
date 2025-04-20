import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return navigate("/");

    const user = JSON.parse(stored);
    setCoords({ lat: user.latitude, lon: user.longitude });

    fetch("https://gulyai-backend-production.up.railway.app/api/people")
      .then((res) => res.json())
      .then((data) => {
        setPeople(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении людей:", err);
        setLoading(false);
      });
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 pt-4 pb-8"
    >
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50">
          <img
            src={selectedPhoto}
            alt="Фото профиля"
            className="max-w-full max-h-[80vh] rounded-xl shadow-xl"
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-300 transition"
          >
            ← Назад
          </button>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => navigate("/profile")}
          className="text-white text-sm hover:opacity-80 transition"
        >
          ← Назад
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">Кто хочет гулять</h1>

      {loading && <p className="text-center text-gray-400">Загрузка...</p>}

      {!loading && people.length === 0 && (
        <p className="text-center text-gray-500">Сейчас никто не онлайн</p>
      )}

      <div className="flex flex-col gap-6">
        {people.map((person, index) => {
          const dist =
            coords && person.latitude && person.longitude
              ? getDistance(
                  coords.lat,
                  coords.lon,
                  person.latitude,
                  person.longitude
                )
              : null;

          return (
            <div
              key={index}
              className="bg-[#2c2c2e] rounded-2xl p-5 border border-zinc-700 shadow-md"
            >
              {person.photo_url && (
                <img
                  src={person.photo_url}
                  alt="Фото"
                  onClick={() => setSelectedPhoto(person.photo_url)}
                  className="w-24 h-24 rounded-full object-cover border mb-4 mx-auto cursor-pointer hover:scale-105 transition"
                />
              )}

              <p className="text-lg font-bold text-center mb-1">
                {person.name}
              </p>
              <p className="text-center text-sm text-gray-400 mb-1">
                {person.age} лет
              </p>
              <p className="text-center text-sm text-gray-400 mb-2">
                {person.address}
              </p>

              <div className="text-center mb-4 space-y-2">
                <div className="inline-block bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm">
                  Цель: <span className="text-emerald-300">{person.activity}</span>
                </div>
                <div className="inline-block bg-zinc-700 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm">
                  Настроение: <span className="text-blue-300">{person.vibe}</span>
                </div>
              </div>

              {dist !== null && (
                <p className="text-center text-xs text-gray-500 mt-1">
                  {dist} метров от тебя
                </p>
              )}

              <div className="mt-4 flex justify-center">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl font-semibold text-black hover:opacity-90 transition">
                  Предложить встретиться
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default People;