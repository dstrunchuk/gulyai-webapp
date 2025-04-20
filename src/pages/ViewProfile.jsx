import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ViewProfile = () => {
  const { chat_id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`https://gulyai-backend-production.up.railway.app/api/profile/${chat_id}`)
      .then(res => res.json())
      .then(setProfile)
      .catch(err => console.error("Ошибка загрузки анкеты:", err));
  }, [chat_id]);

  if (!profile) {
    return <div className="text-white text-center mt-10">Загрузка...</div>;
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-xl font-bold mb-4">Анкета</h1>
      <p><strong>Имя:</strong> {profile.name}</p>
      <p><strong>Адрес:</strong> {profile.address}</p>
      <p><strong>Возраст:</strong> {profile.age}</p>
      <p><strong>Интересы:</strong> {profile.interests}</p>
      <p><strong>Цель:</strong> {profile.activity}</p>
      <p><strong>Настроение:</strong> {profile.vibe}</p>
    </div>
  );
};

export default ViewProfile;