import { Link } from "react-router-dom";

export default function StopPayingHighPrices() {
  return <div className="flex p-10 md:p-0 gap-5 md:gap-0 flex-col md:flex-row justify-around md:h-[24rem] bg-gradient-to-r from-blue-500 dark:from-slate-800 to-blue-400 dark:to-slate-700">
    <div className="uppercase text-white font-semibold flex flex-col gap-4 justify-center">
      <h1 className="text-3xl font-bold">¡Dejá de pagar precios elevados!</h1>
      <div className="flex flex-col gap-2 uppercase text-xl">
        <p>Productos importados a precio de USA</p>
        <p>Pagá en dólares o en pesos argentinos a cotización dólar MEP</p>
        <p>Te llega en menos de 7 días</p>
      </div>
      <h3 className="text-2xl font-bold">¿Qué estás esperando?</h3>
      <Link to="/products">
        <button className="py-2 border-4 text-lg border-white bg-[#ffffff50] transition-all hover:bg-[#ffffff70] text-black dark:text-white w-[14rem]">Ver productos</button>
      </Link>
    </div>
    <img src="prices.png" alt="Deja de pagar precios elevados" />
  </div>
}