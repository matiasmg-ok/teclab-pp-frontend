import { InputHTMLAttributes } from "react";

export default function AdminTextarea({ props }: {
  props: InputHTMLAttributes<HTMLTextAreaElement>
}) {
  return <textarea cols={10} rows={5} className="font-roboto transition-all rounded-sm border-2 focus:border-blue-400 dark:focus:border-slate-200 dark:border-transparent border-blue-200 text-black dark:text-white px-5 py-2 bg-blue-100 dark:bg-slate-800 outline-none border-none" {...props}></textarea>

}