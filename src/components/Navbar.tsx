import { Link } from "react-router-dom";

export default function Navbar() {
  return <>
    <nav className={'w-screen flex items-center h-[5rem] px-10 justify-between'}>
      <img className={'h-[2.5rem] object-contain'} src="horizontal_logo.png" alt="Logo SportsXLife" />
      <div className={'flex gap-5 font-roboto text-lg'}>
        <Link to="/tracking">
          <p>Seguir mi envío</p>
        </Link>
        <Link to="/products">
          <p>Productos</p>
        </Link>
        <Link to="/login">
          <p>Iniciar Sesión</p>
        </Link>
      </div>
    </nav>
  </>
}