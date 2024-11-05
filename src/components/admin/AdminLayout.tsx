import { ReactNode, useState } from "react";
import { User } from "../../types/User";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { MdCategory, MdClose, MdHome, MdImage, MdKeyboardArrowRight, MdLogout, MdMenu, MdPeople, MdSell, MdWeb } from "react-icons/md";

function SidebarOption({ Icon, option, url, includeArrow }: { Icon: IconType, option: string, url: string, includeArrow?: boolean }) {
  return <Link to={url}>
    <div className="flex items-center justify-between gap-4 py-4 px-8 bg-blue-100 from-blue-200 to-blue-100 hover:bg-gradient-to-r dark:from-slate-700 dark:to-black dark:bg-black border-l-[0.15rem] border-transparent dark:hover:border-white transition-all">
      <div className="flex items-center gap-4">
        <Icon size={24} className="text-blue-500 dark:text-white" />
        <p className="font-roboto text-blue-500 dark:text-white font-medium text-md">{option}</p>
      </div>
      {
        includeArrow && <MdKeyboardArrowRight size={24} className="text-blue-500 dark:text-white" />
      }
    </div>
  </Link>
}

export default function AdminLayout({ children }: { user: User, children: ReactNode }) {

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);

  return <div className={'flex flex-col md:flex-row'}>
    <nav className={`${mobileMenuExpanded ? 'hidden' : 'flex md:hidden'} items-center justify-between px-10 w-screen h-[7rem] bg-blue-100 dark:bg-black`}>
      <img className="w-[8rem] py-10 dark:hidden" src="/horizontal_logo.png" alt="Logo de SportsXLife" />
      <img className="w-[8rem] py-10 hidden dark:inline" src="/white_horizontal_logo.png" alt="Logo de SportsXLife" />
      <MdMenu onClick={() => setMobileMenuExpanded(!mobileMenuExpanded)} size={40} className="text-blue-500 dark:text-white" />
    </nav>
    {
      mobileMenuExpanded ? <>
        <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-blue-100 dark:bg-black bg-opacity-50 backdrop-blur-xl">
          <div className="flex items-center justify-between px-10 md:hidden w-screen h-[7rem] bg-blue-100 dark:bg-black">
            <Link to="/">
              <img className="w-[8rem] py-10 dark:hidden" src="/horizontal_logo.png" alt="Logo de SportsXLife" />
              <img className="w-[8rem] py-10 hidden dark:inline" src="/white_horizontal_logo.png" alt="Logo de SportsXLife" />
            </Link>
            <button className="text-black dark:text-white" onClick={() => setMobileMenuExpanded(false)}>
              <MdClose size={40} />
            </button>
          </div>

          <div className={'flex flex-col text-black dark:text-white mt-20 items-center justify-center gap-7 font-roboto font-semibold text-2xl uppercase '}>
            <Link to="/admin">
              <p className="animate-fade-down animate-delay-150 animate-duration-100">Inicio</p>
            </Link>
            <Link to="/admin/users">
              <p className="animate-fade-down animate-delay-150 animate-duration-100">Usuarios</p>
            </Link>
            <Link to="/admin/advertisements">
              <p className="animate-fade-down animate-delay-150 animate-duration-100">Banners</p>
            </Link>
            <Link to="/admin/products">
              <p className="animate-fade-down animate-delay-150 animate-duration-100">Productos</p>
            </Link>
            <Link to="/admin/orders">
              <p className="animate-fade-down animate-delay-150 animate-duration-100">Pedidos</p>
            </Link>
          </div>
        </div>
      </> : <></>
    }
    <aside className={'hidden md:inline w-[20rem] min-h-screen bg-blue-100 dark:bg-black'}>
      <div className="flex items-center justify-center">
        <img className="w-[10rem] py-10 dark:hidden" src="/horizontal_logo.png" alt="Logo de SportsXLife" />
        <img className="w-[10rem] py-10 hidden dark:inline" src="/white_horizontal_logo.png" alt="Logo de SportsXLife" />
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh-10rem)]">
        <div className="flex flex-col gap-2">
          <SidebarOption includeArrow={true} Icon={MdHome} option="Inicio" url="/admin" />
          <SidebarOption includeArrow={true} Icon={MdPeople} option="Usuarios" url="/admin/users" />
          <SidebarOption includeArrow={true} Icon={MdImage} option="Banners" url="/admin/advertisements" />
          <SidebarOption includeArrow={true} Icon={MdCategory} option="Productos" url="/admin/products" />
          <SidebarOption includeArrow={true} Icon={MdSell} option="Pedidos" url="/admin/orders" />
        </div>
        <div className="flex flex-col gap-2">
          <SidebarOption Icon={MdWeb} option="Ir a web principal" url="/" />
          <div onClick={logout}>
            <SidebarOption Icon={MdLogout} option="Cerrar sesión" url="#" />
          </div>
        </div>
      </div>
    </aside>
    <div className={'w-full dark:bg-slate-900 text-black dark:text-white font-roboto overflow-y-auto h-screen relative'}>
      {children}
    </div>
  </div>
}