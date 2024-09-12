import { ReactNode } from "react";
import { User } from "../../types/User";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { MdCategory, MdHome, MdKeyboardArrowRight, MdLogout, MdSell } from "react-icons/md";

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

export default function AdminLayout({ user, children }: { user: User, children: ReactNode }) {
  return <div className={'flex'}>
    <aside className={'w-[20rem] min-h-screen bg-blue-100 dark:bg-black'}>
      <div className="flex items-center justify-center">
        <img className="w-[10rem] py-10 dark:hidden" src="/horizontal_logo.png" alt="Logo de SportsXLife" />
        <img className="w-[10rem] py-10 hidden dark:inline" src="/white_horizontal_logo.png" alt="Logo de SportsXLife" />
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh-10rem)]">
        <div className="flex flex-col gap-2">
          <SidebarOption includeArrow={true} Icon={MdHome} option="Inicio" url="/admin" />
          <SidebarOption includeArrow={true} Icon={MdCategory} option="Productos" url="/admin/products" />
          <SidebarOption includeArrow={true} Icon={MdSell} option="Pedidos" url="/admin/orders" />
        </div>
        <div className="flex flex-col gap-2">
          <SidebarOption Icon={MdLogout} option="Cerrar sesión" url="/logout" />
        </div>
      </div>
    </aside>
    <div className={'w-full dark:bg-slate-900 text-white font-roboto overflow-y-auto h-screen'}>
      {children}
    </div>
  </div>
}