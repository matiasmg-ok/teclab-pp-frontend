import { InputHTMLAttributes } from "react";
import { IconType } from "react-icons";

export default function AdminInput({ props, Icon }: {
  props: InputHTMLAttributes<HTMLInputElement>,
  Icon?: IconType,
}) {
  return <div className="flex font-roboto transition-all items-center rounded-sm border-2 focus-within:border-blue-400 dark:focus-within:border-slate-200 dark:border-transparent border-blue-200 justify-center px-5 h-[3rem] bg-blue-100 dark:bg-slate-800">
    <input className="bg-transparent outline-none border-none text-black dark:text-white" {...props} />
    {Icon && <Icon size={20} className="text-blue-400 dark:text-slate-200" />}
  </div>
}