import { useNavigate, useLocation } from 'react-router-dom';
import MenuButton from '../components/global/MenuButton';
import LogoUnivalleLight from '../assets/logo_univalle_light.svg';
import '../styles/TopNavbar.css';
import LogoutButton from './auth/LogoutButton';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';
  const navigate = useNavigate();
  const location = useLocation();

  // Esta función se encarga de navegar a la ruta proporcionada
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
        flexGrow: 1 }}>
        
        {/* Botones de navegación */}
        <MenuButton 
          text="Becas" 
          isActive={location.pathname === "/becas"} 
          onClick={() => handleButtonClick("/becas")} 
        />
        <MenuButton 
          text="Citas" 
          isActive={location.pathname === "/citas"} 
          onClick={() => handleButtonClick("/citas")} 
        />
      </div>
      <LogoutButton/>
    </header>
  );
}
