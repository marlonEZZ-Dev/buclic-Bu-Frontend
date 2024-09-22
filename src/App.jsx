import { Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import Becas from "./pages/student/Becas";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      
      <Route path="login" element={<LoginPage />} />
      
      <Route path="/admin/*" element={<AdminPage />} />
      
      <Route path="/student/*" element={<StudentPage />} />
      <Route path="/student/becas" element={<Becas />} />
      <Route path="/student/citas" element={<Becas />} />
    </Routes>
  );
}

export default App;
