import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Product } from "../types/Product";
import { client, useClient } from "../utils/loggedClient";
import { useUnloggedClient } from "../utils/unloggedClient";
import { MdArrowBackIos } from "react-icons/md";

export default function ProductPage() {
  const url = new URLSearchParams(window.location.search);
  const productId = url.get('id');

  const [{ data: user }] = useClient('/users/whoami');
  const [{ data: product }] = useUnloggedClient<Product>(`/products/${productId}`);
  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization');


  if (!product) {
    return <p>Cargando...</p>
  }

  function createOrder() {
    if (!product) return;

    if (!user) {
      window.localStorage.setItem('login-redirect', JSON.stringify({
        url: window.location.href,
        date: new Date()
      }));

      return window.location.href = '/login';
    }

    return window.location.href = '/checkout?productId=' + product.id;
  }

  return (
    product && cotization && <>
      <Navbar />
      <div className="flex justify-center gap-20 px-20 w-full">
        <img src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} className="w-[30rem]" />
        <div className="font-roboto flex flex-col gap-2">
          <div onClick={() => window.history.back()} className="mb-4 cursor-pointer flex items-center font-semibold text-xl">
            <MdArrowBackIos size={32} />
            <p>Volver atrás</p>
          </div>
          <p>{product.group}</p>
          <h1 className="font-semibold text-3xl">{product.name}</h1>
          <h3 className={'font-semibold text-2xl'}>USD {product.price}</h3>
          <p className="text-lg font-medium">AR${(product.price * cotization?.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <span className="italic text-sm">(TC: ${cotization?.price}/usd)</span></p>
          <p>{product.description}</p>
          <button onClick={createOrder} className="w-[7rem] py-2 px-5 bg-blue-400 rounded-sm text-white mt-5 font-medium text-lg hover:bg-blue-500 transition-all">Comprar</button>
        </div>
      </div>
      <Footer />
    </>
  )
}