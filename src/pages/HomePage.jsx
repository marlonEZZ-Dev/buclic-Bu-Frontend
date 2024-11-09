import "../styles/HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="background-image">
      <div className="welcome-box">
        <h1 className="welcome-title">Te damos la bienvenida</h1>
        <p className="welcome-text">
          Con BuClick, gestiona tus becas de alimentación y reserva citas de
          bienestar en un solo clic. ¡Todo en un solo lugar para ahorrarte
          tiempo y estrés!
        </p>
        <Link to="/login">
          <button className="welcome-button">BuClick</button>
        </Link>
      </div>
    </div>
  );
}
