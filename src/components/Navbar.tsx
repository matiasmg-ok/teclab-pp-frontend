import { Link } from "react-router-dom";
import { useClient } from "../utils/loggedClient";
import { MdDashboard, MdLogout, MdPerson, MdShoppingCart } from "react-icons/md";
import { ReactNode, useState } from "react";
import { User } from "../types/User";

function MenuButton({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
  return <button onClick={onClick} className="bg-blue-300 hover:bg-blue-400 text-black py-2 px-4 rounded transition-all flex items-center gap-2">{children}</button>
}

export default function Navbar() {

  const [{ data: user }] = useClient<User>('/users/whoami');

  const [optionsExpanded, setOptionsExpanded] = useState(false);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return <>
    <nav className={'w-screen flex items-center h-[5rem] px-10 justify-between'}>
      <Link to="/">
        <img className={'h-[2.5rem] object-contain'} src="/horizontal_logo.png" alt="Logo SportsXLife" />
      </Link>
      <div className={'flex gap-5 font-roboto text-lg items-center'}>
        <Link to="/products">
          <p>Productos</p>
        </Link>
        {
          user ?
            <>
              <div onClick={() => setOptionsExpanded(!optionsExpanded)} className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 cursor-pointer">
                <MdPerson size={24} />
              </div>
              {
                optionsExpanded && <div className="w-[14rem] absolute z-50 top-[5rem] right-[1.5rem] p-5 rounded-md bg-blue-200">
                  <p className="text-md text-center mb-2 break-words">Hola, {user.name}</p>
                  <div className="flex flex-col gap-2">
                    {
                      user.profile === 'admin' ? <Link target="_blank" className="w-full flex flex-col" to="/admin"><MenuButton> <MdDashboard /> Administrar </MenuButton></Link> : <Link target="_blank" className="w-full flex flex-col" to="/dashboard/orders"><MenuButton> <MdShoppingCart /> Mis compras </MenuButton></Link>
                    }

                    <MenuButton onClick={logout}> <MdLogout /> Cerrar sesión</MenuButton>
                  </div>
                </div>
              }
            </> : <Link to="/login">
              <p>Iniciar Sesión</p>
            </Link>
        }
      </div>
    </nav>
  </>
}