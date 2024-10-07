import { useNavigate, useLocation } from 'react-router-dom';
import MenuButton from '../global/MenuButton';
import LogoUnivalleLight from '../../assets/logo_univalle_light.svg';
import '../../styles/TopNavbar.css';
import LogoutButton from '../auth/LogoutButton';
import React from 'react';

export default function HeaderAdmin(props) {
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
          text="Gestión de usuarios" 
          isActive={location.pathname === "/usuarios"} 
          onClick={() => handleButtonClick("/usuarios")} 
        />
        <MenuButton 
          text="Informes" 
          isActive={location.pathname === "/informes"} 
          onClick={() => handleButtonClick("/informes")} 
        />
        <MenuButton 
          text="Menú del día" 
          isActive={location.pathname === "/menu"} 
          onClick={() => handleButtonClick("/menu")} 
        />
        <MenuButton 
          text="Becas" 
          isActive={location.pathname === "/becaAdm"} 
          onClick={() => handleButtonClick("/becaAdm")} 
        />
        <MenuButton 
          text="Citas" 
          isActive={location.pathname === "/citasAdm"} 
          onClick={() => handleButtonClick("/citasAdm")} 
        />
        <MenuButton 
          text="Reservas" 
          isActive={location.pathname === "/reservas"} 
          onClick={() => handleButtonClick("/reservas")} 
        />
        <MenuButton 
          text="Ajustes" 
          isActive={location.pathname === "/perfilAdmin"} 
          onClick={() => handleButtonClick("/perfilAdmin")} 
        />
      </div>
      <LogoutButton />
    </header>
  );
}
