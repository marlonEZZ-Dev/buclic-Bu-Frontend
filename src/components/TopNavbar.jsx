import React from 'react';
import { Link } from 'react-router-dom';
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
        width: '100vw',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <Link to="/" style={{ marginRight: 'auto' }}>
        <img 
          src={LogoUnivalleLight} 
          alt="Logo Universidad del Valle" 
          style={{ height: '60px' }} 
        />
      </Link>
    </header>
  );
}

TopNavbar.propTypes = {
  session: PropTypes.bool,
  dark: PropTypes.bool
};