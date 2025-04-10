import React, { useEffect, useState } from "react";

const mockUsers = [
  {
    name: "Саша",
    city: "Москва",
    goal: "кофе",
    interests: "фотография, книги",
    username: "sasha_123",
  },
  {
    name: "Мила",
    city: "Питер",
    goal: "прогулка",
    interests: "музыка, бар",
    username: "mila_chat",
  },
  {
    name: "Артур",
    city: "Москва",
    goal: "покурить",
    interests: "айти, игры",
    username: "art_dev",
  },
];

export default function People() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("formData");
    if (data) {
      setFormData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">🧍 Люди рядом</h1>

      {mockUsers.map((user, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border shadow space-y-1 bg-white"
        >
          <p>
            <strong>{user.name}</strong> из {user.city}
          </p>
          <p>🎯 Цель: {user.goal}</p>
          <p>🎈 Интересы: {user.interests}</p>
          <a
            href={`https://t.me/${user.username}`}
            target="_blank"
            className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Написать в Telegram
          </a>
        </div>
      ))}
    </div>
  );
}
