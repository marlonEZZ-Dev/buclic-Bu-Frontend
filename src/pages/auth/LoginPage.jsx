import React, { Fragment, useState } from "react";
import { Card, Input, Button, message } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import "../../styles/background.css";
import Header from '../../components/auth/Header';
import api from '../../api';
import { ACCESS_TOKEN } from "../../constants";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roleToRouteMap = {
    "ADMINISTRADOR": "/usuarios",
    "MONITOR": "/usuarios",
    "ESTUDIANTE": "/citas",
    "PSICOLOGO": "/beca",
    "ENFERMERO": "/usuarios",
    "ODONTOLOGO": "/usuarios",
    "EXTERNO": "/usuarios",
  };

  const manejarClick = (e) => {
    e.preventDefault(); 
    navigate('/reestablecercontrasena'); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        const userResponse = response.data.userResponse;
        const roles = userResponse.roles.map(role => role.name);  // Extraer el array del rol

        // Guardar token y username en localStorage
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem('username', username);

        // message.success('Inicio de sesión exitoso');

        // Redireccionar basado en el rol
        const userRole = roles[0];  //toma el primer rol
        const route = roleToRouteMap[userRole];

        if (route) {
          navigate(route);
        } else {
          message.error('No se encontró una ruta correspondiente al rol del usuario');
        }
      } else {
        throw new Error('Token no recibido');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      message.error('Error en el inicio de sesión. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username !== "" && password !== "";

  return (
    <Fragment>
      <Header />
      
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F5F5F5",
      }}>
        <Card
          hoverable
          title={
            <div style={{ 
              textAlign: "center", 
              fontSize: "24px",
              color: "#C20E1A",
            }}>
              Bienestar Universitario
            </div>
          }
          style={{
            width: 401,
            height: "auto",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Usuario"
              prefix={<UserOutlined />}
              style={{ height: 33, width: "100%", marginBottom: 20 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input.Password
              placeholder="Contraseña"
              iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              style={{ height: 33, width: "100%", marginBottom: 20 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isFormValid}  // Deshabilitar el botón si el formulario no es válido
              style={{
                width: "100%",
                height: 33,
                backgroundColor: isFormValid ? "#C20E1A" : "#D64545", // Cambiar color cuando esté habilitado
                borderColor: isFormValid ? "#C20E1A" : "#D64545",
              }}
            >
              Iniciar sesión
            </Button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <a onClick={manejarClick} style={{ color: "#C20E1A" }}>
                ¿Olvidó su nombre de usuario o contraseña?
              </a>
            </div>
          </form>
        </Card>
      </div>
    </Fragment>
  );
}
