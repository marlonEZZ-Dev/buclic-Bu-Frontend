import React from 'react';
import { Link } from 'react-router-dom';
import MenuButton from '../global/MenuButton'
import LogoUnivalleLight from '../../assets/logo_univalle_light.svg';
import PropTypes from 'prop-types';
import '../../styles/TopNavbar.css';
import LogoutButton from '../auth/LogoutButton';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';

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
        zIndex: 1000
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
      {/* div para centrarlos */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexGrow: 1
      }}>
        <Link to="/usuarios">
          <MenuButton text="Gestión de usuarios" />
        </Link>
        <Link to="/informes">
          <MenuButton text="Informes" />
        </Link>
        <Link to="/menu">
          <MenuButton text="Menú del día" />
        </Link>
        <Link to="/becaAdm">
          <MenuButton text="becas" />
        </Link>
        <Link to="/citasAdm">
          <MenuButton text="citas" />
        </Link>
      </div>
      <LogoutButton />
    </header>
  );
}