import React from 'react';
import { Link } from 'react-router-dom';
import MenuButton from '../components/global/MenuButton';
import LogoUnivalleLight from '../assets/logo_univalle_light.svg';
import PropTypes from 'prop-types';
import '../styles/TopNavbar.css';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';

  return (
    <header 
      id='univalle-logo-header' 
      className={session}
      style={{
        backgroundColor: '#C20E1A',
        width: '100vw', // Para que ocupe todo el ancho de la pantalla
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed', // Para mantenerlo fijo en la parte superior
        top: 0, // Alineado con la parte superior de la ventana
        left: 0, // Alineado con la parte izquierda
        zIndex: 1000, // Para asegurarse de que esté por encima del contenido
      }}
    >
      <Link to="/" style={{ marginRight: 'auto' }}>
        <img 
          src={LogoUnivalleLight} 
          alt="Logo Universidad del Valle" 
          style={{ height: '60px' }} 
        />
      </Link>

      {/* Contenedor para los botones */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <Link to="/student/becas">
          <MenuButton text="Becas" />
        </Link>
        <Link to="/student/citas">
          <MenuButton text="Citas" />
        </Link>
      </div>

    </header>
  );
}