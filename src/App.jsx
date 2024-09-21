import { Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      
      <Route path="login" element={<LoginPage />} />
      
      <Route path="/admin/*" element={<AdminPage />} />
      
      <Route path="/student/*" element={<StudentPage />} />
    
    </Routes>
  );
}

export default App;
