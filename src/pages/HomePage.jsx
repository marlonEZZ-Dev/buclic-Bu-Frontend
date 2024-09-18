import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div className="mx-auto w-[70%]">
        <Link to="./login">Click para iniciar sesión</Link>
      </div>
    </>
  );
}
