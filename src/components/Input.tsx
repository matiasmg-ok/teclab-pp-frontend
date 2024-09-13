import { InputHTMLAttributes } from "react";
import { IconType } from "react-icons";

export default function Input({ props, Icon }: {
  props: InputHTMLAttributes<HTMLInputElement>,
  Icon?: IconType,
}) {
  return <div className="flex font-roboto transition-all items-center rounded-sm border-2 focus-within:border-blue-400 border-blue-200 justify-center px-5 h-[3rem] bg-blue-100">
    <input className="bg-transparent outline-none border-none" {...props} />
    {Icon && <Icon size={20} className="text-blue-400" />}
  </div>
}