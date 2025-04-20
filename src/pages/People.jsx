import { useEffect, useState } from "react";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => {
        console.warn("Не удалось получить геолокацию", err);
      }
    );
  }, []);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch("https://gulyai-backend-production.up.railway.app/api/people");
        const data = await res.json();
        setPeople(data);
      } catch (err) {
        console.error("Ошибка загрузки", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1c1c1e] text-white">
        ⏳ Загрузка анкет...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1c1c1e] text-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Кто хочет гулять</h1>

      {people.length === 0 ? (
        <p className="text-center text-gray-400">Пока никто не в онлайне...</p>
      ) : (
        <div className="space-y-6">
          {people.map((person) => {
            const dist =
              userCoords && person.latitude && person.longitude
                ? getDistance(
                    userCoords.lat,
                    userCoords.lon,
                    person.latitude,
                    person.longitude
                  )
                : null;

            return (
              <div
                key={person.chat_id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 shadow-md"
              >
                {person.photo_url && (
                  <img
                    src={person.photo_url}
                    alt="Фото"
                    className="w-24 h-24 rounded-full object-cover border mb-4 mx-auto"
                  />
                )}
                <p className="text-lg font-bold text-center mb-1">{person.name}</p>
                <p className="text-center text-sm text-gray-400 mb-2">{person.age} лет</p>
                <p className="text-center text-sm text-gray-400">{person.address}</p>
                <p><span className="text-zinc-400">Цель:</span> {user.activity}</p>
                <p><span className="text-zinc-400">Настроение:</span> {user.vibe}</p>
                {dist !== null && (
                  <p className="text-center text-xs text-gray-500 mt-1">{dist} метров от тебя</p>
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
      )}
    </div>
  );
};

export default People;