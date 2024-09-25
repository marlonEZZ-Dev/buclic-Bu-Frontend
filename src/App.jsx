import { Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import Becas from "./pages/student/Becas";
import Appointments from "./pages/student/Appointments";
import './App.css';
import MainStudentView from "./pages/student/MainStudentView";
import ManagementUsers from "./pages/admin/ManagementUsers";
import Informs from "./pages/admin/Informs";
import Menu from "./pages/admin/Menu";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      
      <Route path="login" element={<LoginPage />} />
      <Route path="reestablecercontrasena" element={<MainStudentView/>}/>
      
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/usuarios" element={<ManagementUsers/>}/>
      <Route path="/informes" element={<Informs/>}/>
      <Route path="/menu" element={<Menu/>}/>
      <Route path="/becaAdm" element={<Becas/>}/>
      <Route path="/citasAdm" element={<Appointments/>}/>
      
      
      {/* <Route path="/student/*" element={<StudentPage />} /> */}
      <Route path="/becas" element={<Becas />} />
      <Route path="/citas" element={<Appointments />} />
    </Routes>
  );
}

export default App;
