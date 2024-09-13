import { MdKeyboardArrowRight } from "react-icons/md";
import { Product } from "../../types/Product";

export default function AdminProductCard({ product }: { product: Product }) {
  return <>
    <div className="w-[29rem] min-h-[9rem] group bg-blue-100 text-black dark:text-white dark:bg-slate-800 flex justify-between items-center px-5 rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-400 dark:hover:border-slate-200 transition-all">
      <div className="flex items-center">
        <div className={'w-[7rem] h-[7rem] bg-slate-500 rounded-lg'}></div>
        <div className="flex flex-col font-roboto px-5">
          <h3 className={'text-xl font-semibold'}>{product.name}</h3>
          <p>{product.group}</p>
          <p className='mt-4 font-medium text-lg'>USD {product.price}</p>
        </div>
      </div>
      <MdKeyboardArrowRight size={28} className="text-slate-500 group-hover:border-blue-400 group-hover:dark:text-slate-200 transition-all" />
    </div>
  </>
}