import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./pages/Form";
import Profile from "./pages/Profile";
import People from "./pages/People";
import ViewProfile from "./pages/ViewProfile";



function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Form />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/people" element={<People />} />
    <Route path="/view-profile/:chat_id" element={<ViewProfile />} />
  </Routes>
</Router>
  );
}

export default App;