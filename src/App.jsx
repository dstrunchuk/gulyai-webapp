import { useState, useEffect } from 'react'

export default function App() {
  const [form, setForm] = useState({
    name: '',
    district: '',
    interests: '',
    activity: '',
  })

  useEffect(() => {
    const tg = window.Telegram.WebApp
    tg.expand()
    tg.ready()

    const user = tg.initDataUnsafe?.user
    if (user?.first_name) {
      setForm((prev) => ({ ...prev, name: user.first_name }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tg = window.Telegram.WebApp
    tg.sendData(JSON.stringify(form))
    tg.close()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Анкета Gulyai</h1>

        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl"
          required
        />

        <input
          type="text"
          name="district"
          placeholder="Район / Город"
          value={form.district}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl"
          required
        />

        <textarea
          name="interests"
          placeholder="Интересы"
          value={form.interests}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl"
          required
        />

        <div className="space-y-2">
          <label className="block font-medium">Цель встречи:</label>
          <select
            name="activity"
            value={form.activity}
            onChange={handleChange}
            className="w-full p-2 border rounded-xl"
            required
          >
            <option value="">Выбери...</option>
            <option value="coffee">Кофе</option>
            <option value="walk">Прогуляться</option>
            <option value="smoke">Покурить</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
        >
          Готов к встрече
        </button>
      </form>
    </div>
  )
}
