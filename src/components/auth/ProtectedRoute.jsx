/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ACCESS_TOKEN } from "../../constants";
import { useState, useEffect } from "react";
import { Spin, Typography } from "antd";

import AdminPage from "../../pages/admin/ManagementUsers";
import MonitorPage from "../../pages/admin/ManagementUsers";
import StudentPage from "../../pages/student/Becas";
import PsychologistPage from "../../pages/admin/ManagementUsers";
import NursePage from "../../pages/admin/ManagementUsers";
import DentistPage from "../../pages/admin/ManagementUsers";
import ExternalPage from "../../pages/student/Becas";

// Mapeo dinámico de roles a componentes
const roleToComponentMap = {
  "ROLE_ADMINISTRADOR": AdminPage,
  "ROLE_MONITOR": MonitorPage,
  "ROLE_ESTUDIANTE": StudentPage,
  "ROLE_PSICOLOGO": PsychologistPage,
  "ROLE_ENFERMERO": NursePage,
  "ROLE_ODONTOLOGO": DentistPage,
  "ROLE_EXTERNO": ExternalPage,
};

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const userRole = decoded.authorities; // Usar el rol desde el token

    // Verificar si el rol del usuario está en los roles permitidos
    if (allowedRoles.includes(userRole)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [allowedRoles, token, location]);

  if (isAuthorized === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
        <Typography.Text>Cargando...</Typography.Text>
      </div>
    );
  }

  if (isAuthorized) {
    const userRole = jwtDecode(token).authorities; // Usar el rol directamente desde el token

    // Buscar el componente correspondiente al rol
    const PageComponent = roleToComponentMap[userRole];

    // Si existe un componente para este rol, renderizarlo
    if (PageComponent) {
      return <PageComponent />;
    } else {
      return <Typography.Text>No tienes acceso a esta sección</Typography.Text>;
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
