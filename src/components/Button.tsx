import { ReactNode } from "react";

export default function Button({ children, onClick }: { children: ReactNode, onClick?: () => void }) {
  return <button onClick={onClick} className="bg-blue-500 dark:bg-slate-800 hover:bg-blue-400 dark:hover:bg-slate-800 border-2 border-transparent dark:hover:border-slate-200 text-white font-bold py-2 px-4 rounded transition-all flex items-center gap-2">{children}</button>
}