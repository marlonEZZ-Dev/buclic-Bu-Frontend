import { useNavigate, useLocation } from 'react-router-dom';
import MenuButton from '../components/global/MenuButton';
import LogoUnivalleLight from '../assets/logo_univalle_light.svg';
import '../styles/TopNavbar.css';
import LogoutButton from './auth/LogoutButton';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <header 
      id='univalle-logo-header' 
      className={session}
    >
      <div style={{ marginRight: 'auto' }}>
        <img 
          src={LogoUnivalleLight} 
          alt="Logo Universidad del Valle" 
          style={{ height: '60px' }} 
        />
      </div>

      <div className="menu-buttons" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
      }}>
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
        <MenuButton 
          text="Ajustes" 
          isActive={location.pathname === "/ajustes"} 
          onClick={() => handleButtonClick("/ajustes")} 
        />
      </div>
      <LogoutButton/>
    </header>
  );
}
