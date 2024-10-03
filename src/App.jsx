import { Routes, Route} from "react-router-dom";
import RecoverPassword from "./pages/auth/RecoverPassword";
import ConfirmationPassword from "./pages/auth/ConfirmationPassword";
import HomePage from "./pages/HomePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/auth/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import Becas from "./pages/student/Becas";
import Appointments from "./pages/student/Appointments";
import MainStudentView from "./pages/student/MainStudentView";
import ManagementUsers from "./pages/admin/ManagementUsers";
import Informs from "./pages/admin/Informs";
import Menu from "./pages/admin/Menu";
import Reservations from "./pages/admin/Reservations";
import Settings from "./pages/student/Settings";
import Psychologist from "./pages/student/Psychologist";
import Nursing from "./pages/student/Nursing";
import Dentist from "./pages/student/Dentist";
import ChangePassword from "./pages/student/ChangePassword";
import BecasAdmin from "./pages/admin/BecasAdmin";
import NursingAdmin from "./pages/admin/NursingAdmin";
import PsychologistAdmin from "./pages/admin/PsychologistAdmin";
import DentistAdmin from "./pages/admin/DentistAdmin";
import AppointmentsAdmin from "./pages/admin/AppointmentsAdmin";
import BecasPsych from "./pages/psychology/BecasPsych";
import AppointmentsPsych from "./pages/psychology/AppointmentsPsych";
import SchedulesPsych from "./pages/psychology/SchedulesPsych";
import AgendaPsych from "./pages/psychology/AgendaPsych";
import Tracking from "./pages/psychology/Tracking";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="reestablecercontrasena" element={<RecoverPassword/>}/>
      <Route path="confirmarcontrasena" element={<ConfirmationPassword/>}/>
      
      {/* Rutas para admin */}
      <Route path="/usuarios" element={<ManagementUsers/>}/>
      <Route path="/informes" element={<Informs/>}/>
      <Route path="/menu" element={<Menu/>}/>
      <Route path="/becaAdm" element={<BecasAdmin/>}/>
      <Route path="/citasAdm" element={<AppointmentsAdmin/>}/>
      <Route path="/reservas" element={<Reservations/>}/>
      <Route path="/enfermeriaAdmin" element={<NursingAdmin/>}/>
      <Route path="/psicologiaAdmin" element={<PsychologistAdmin/>}/>
      <Route path="/odontologiaAdmin" element={<DentistAdmin/>}/>
      
      {/* Rutas para Estudiante */}
      <Route path="/becas" element={<Becas />} />
      <Route path="/citas" element={<Appointments />} />
      <Route path="/ajustes" element={<Settings />} />
      <Route path="/cambiarContrasena" element={<ChangePassword />} />
      <Route path="/psicologia" element={<Psychologist />} />
      <Route path="/enfermeria" element={<Nursing />} />
      <Route path="/odontologia" element={<Dentist />} />

      {/* Rutas para Psicologo */}
      <Route path="/beca" element={<BecasPsych/>} />
      <Route path="/cita" element={<AppointmentsPsych/>}/>
      <Route path="/horario" element={<SchedulesPsych/>}/>
      <Route path="/agenda" element={<AgendaPsych/>}/>
      <Route path="/seguimiento" element={<Tracking/>}/>

    </Routes>
  );
}

export default App;
