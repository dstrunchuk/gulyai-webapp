import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./pages/Form";
import Profile from "./pages/Profile";
import People from "./pages/People"; // путь укажи правильный, если у тебя файл в другом месте

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/people" element={<People />} />
      </Routes>
    </Router>
  );
}

export default App;