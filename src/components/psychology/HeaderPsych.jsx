import { useNavigate, useLocation } from 'react-router-dom';
import MenuButton from '../global/MenuButton';
import LogoUnivalleLight from '../../assets/logo_univalle_light.svg';
import '../../styles/TopNavbar.css';
import LogoutButton from '../auth/LogoutButton';
import React from 'react';

export default function HeaderPsych(props) {
  const session = props.session ? 'session' : 'header-admin';
  const navigate = useNavigate();
  const location = useLocation();

  // Función para manejar el clic en los botones y navegar
  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <header
      id='univalle-logo-header'
      className={session}
      style={{
        backgroundColor: '#C20E1A',
        width: '100vw',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ marginRight: 'auto' }}>
        <img
          src={LogoUnivalleLight}
          alt="Logo Universidad del Valle"
          style={{ height: '60px' }}
        />
      </div>

      {/* Contenedor para los botones */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexGrow: 1
      }}>
        <MenuButton 
          text="Becas" 
          isActive={location.pathname === "/beca"} 
          onClick={() => handleButtonClick("/beca")} 
        />
        <MenuButton 
          text="Citas" 
          isActive={location.pathname === "/cita"} 
          onClick={() => handleButtonClick("/cita")} 
        />
        <MenuButton 
          text="Horarios" 
          isActive={location.pathname === "/horario"} 
          onClick={() => handleButtonClick("/horario")} 
        />
        <MenuButton 
          text="Agenda" 
          isActive={location.pathname === "/agenda"} 
          onClick={() => handleButtonClick("/agenda")} 
        />
        {/* <MenuButton 
          text="Seguimiento" 
          isActive={location.pathname === "/citasAdm"} 
          onClick={() => handleButtonClick("/citasAdm")} 
        /> */}
        
      </div>
      <LogoutButton />
    </header>
  );
}
