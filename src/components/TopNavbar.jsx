import { Link } from 'react-router-dom';
import LogoUnivalleDark from '../assets/logo_univalle_dark.svg';
import PropTypes from 'prop-types';
import '../styles/TopNavbar.css';

export default function TopNavbar(props) {
  const session = props.session ? 'session' : 'top-navbar';

  return (
    <header id='univalle-logo-header' className={session}>
      <Link to="/">
        <img src={LogoUnivalleDark} alt="Logo Universidad del Valle" />
      </Link>
    </header>
  );
}

TopNavbar.propTypes = {
  session: PropTypes.bool,
  dark: PropTypes.bool
};
