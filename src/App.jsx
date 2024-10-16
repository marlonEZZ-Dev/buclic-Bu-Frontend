import { Routes, Route } from "react-router-dom";
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
import ViewInforms from "./pages/admin/ViewInforms";
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
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import PasswordAdmin from "./pages/admin/PasswordAdmin";
import BecasPsych from "./pages/psychology/BecasPsych";
import AppointmentsPsych from "./pages/psychology/AppointmentsPsych";
import SchedulesPsych from "./pages/psychology/SchedulesPsych";
import AgendaPsych from "./pages/psychology/AgendaPsych";
import Tracking from "./pages/psychology/Tracking";
import { MenuProvider } from "./utils/MenuContext"; // Importar el MenuProvider>
import { SettingsProvider } from "./utils/SettingsContext";
import AgendaNurse from "./pages/nurse/AgendaNurse";
import SettingNurse from "./pages/nurse/SettingNurse";
import AppointmentsNurse from "./pages/nurse/AppointmentsNurse";
import BecasNurse from "./pages/nurse/VisitsNurse";
import HistoryNurse from "./pages/nurse/HistoryNurse";
import InformNurse from "./pages/nurse/InformNurse";
import SchedulesNurse from "./pages/nurse/SchedulesNurse";
import VisitsNurse from "./pages/nurse/VisitsNurse";
import BecasDentist from "./pages/dentist/BecasDentist";
import AppointmentDentist from "./pages/dentist/AppointmentDentist";
import SchedulesDentist from "./pages/dentist/SchedulesDentist";
import AgendaDentist from "./pages/dentist/AgendaDentist";
import VisitsDentist from "./pages/dentist/VisitsDentist";
import HistoryDentist from "./pages/dentist/HistoryDentist";
import SettingDentist from "./pages/dentist/SetttingDentist";
import BecasMonitor from "./pages/monitor/BecasMonitor";
import AppointmentMonitor from "./pages/monitor/AppointmentMonitor";
import Reservation from "./pages/monitor/Reservation";
import MenuMonitor from "./pages/monitor/MenuMonitor";
import SettingMonitor from "./pages/monitor/SettingMonitor";
import ChangePasswordWorker from "./pages/worker/ChangePasswordWorker";
import AppointmentsWorker from "./pages/worker/AppointmentsWorker"
import BecasWorker from "./pages/worker/BecasWorker"
import DentistWorker from "./pages/worker/DentistWorker"
import NursingWorker from "./pages/worker/NursingWorker"
import PsychologistWorker from "./pages/worker/PsychologistWorker"
import SettingWorker from "./pages/worker/SettingWorker"
import BecasExternal from "./pages/external/BecasExternal";
import SettingExternal from "./pages/external/SettingExternal";
import ChangePasswordExt from "./pages/external/ChangePasswordExt";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Outlet } from "react-router-dom";


function App() {
  return (
    <MenuProvider>
      {" "}
      {/* proveedor del contexto */}
      <SettingsProvider>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="reestablecercontrasena" element={<RecoverPassword />} />
          <Route path="confirmarcontrasena" element={<ConfirmationPassword />} />

          
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de administrador */}
        <Route path="usuarios" element={<ManagementUsers />} />
        <Route path="informes" element={<Informs />} />
        <Route path="VerInformes" element={<ViewInforms />} />
        <Route path="menu" element={<Menu />} />
        <Route path="becaAdm" element={<BecasAdmin />} />
        <Route path="citasAdm" element={<AppointmentsAdmin />} />
        <Route path="reservas" element={<Reservations />} />
        <Route path="enfermeriaAdmin" element={<NursingAdmin />} />
        <Route path="psicologiaAdmin" element={<PsychologistAdmin />} />
        <Route path="odontologiaAdmin" element={<DentistAdmin />} />
        <Route path="perfilAdmin" element={<SettingsAdmin />} />
        <Route path="contrasenaAdmin" element={<PasswordAdmin />} />

        </Route>

        <Route path="/estudiante" element={<ProtectedRoute allowedRoles={["ESTUDIANTE"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de estudiante */}
        <Route path="becas" element={<Becas />} />
        <Route path="citas" element={<Appointments />} />
        <Route path="ajustes" element={<Settings />} />
        <Route path="cambiarContrasena" element={<ChangePassword />} />
        <Route path="psicologia" element={<Psychologist />} />
        <Route path="enfermeria" element={<Nursing />} />
        <Route path="odontologia" element={<Dentist />} />

        </Route>

        <Route path="/psicologo" element={<ProtectedRoute allowedRoles={["PSICOLOGO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de psicólogo */}
        <Route path="beca" element={<BecasPsych />} />
        <Route path="cita" element={<AppointmentsPsych />} />
        <Route path="horario" element={<SchedulesPsych />} />
        <Route path="agenda" element={<AgendaPsych />} />
        <Route path="seguimiento" element={<Tracking />} />

        </Route>

        <Route path="/enfermeria" element={<ProtectedRoute allowedRoles={["ENFERMERO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de enfermería */}
        <Route path="becas" element={<BecasNurse />} />
        <Route path="citas" element={<AppointmentsNurse />} />
        <Route path="horarios" element={<SchedulesNurse />} />
        <Route path="agendas" element={<AgendaNurse />} />
        <Route path="actividades" element={<VisitsNurse />} />
        <Route path="historial" element={<HistoryNurse />} />
        <Route path="informe" element={<InformNurse />} />
        <Route path="ajuste" element={<SettingNurse />} />

        </Route>

        <Route path="/odontologia" element={<ProtectedRoute allowedRoles={["ODONTOLOGO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de odontología */}
        <Route path="becas" element={<BecasDentist />} />
        <Route path="citas" element={<AppointmentDentist />} />
        <Route path="horarios" element={<SchedulesDentist />} />
        <Route path="agenda" element={<AgendaDentist />} />
        <Route path="visitas" element={<VisitsDentist />} />
        <Route path="historial" element={<HistoryDentist />} />
        <Route path="ajustes" element={<SettingDentist />} />
        </Route>

        <Route path="/monitor" element={<ProtectedRoute allowedRoles={["MONITOR"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de monitor */}
        <Route path="becas" element={<BecasMonitor />} />
        <Route path="citas" element={<AppointmentMonitor />} />
        <Route path="reservas" element={<Reservation />} />
        <Route path="menu" element={<MenuMonitor />} />
        <Route path="ajustes" element={<SettingMonitor />} />
        </Route>

        <Route path="/funcionario" element={<ProtectedRoute allowedRoles={["FUNCIONARIO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de funcionario */}
        <Route path="becas" element={<BecasWorker />} />
        <Route path="citas" element={<AppointmentsWorker />} />
        <Route path="ajustes" element={<SettingWorker />} />
        <Route path="cambiarContrasena" element={<ChangePasswordWorker />} />
        <Route path="psicologia" element={<PsychologistWorker />} />
        <Route path="enfermeria" element={<NursingWorker />} />
        <Route path="odontologia" element={<DentistWorker />} />
        </Route>

        <Route path="/externo" element={<ProtectedRoute allowedRoles={["EXTERNO"]}><Outlet /></ProtectedRoute>}>
        {/* Rutas hijas de externo */}
        <Route path="becas" element={<BecasExternal />} />
        <Route path="ajustes" element={<SettingExternal />} />
        <Route path="cambiarContrasena" element={<ChangePasswordExt />} />
        </Route>

        </Routes>
      </SettingsProvider>
    </MenuProvider>
  );
}

export default App;
