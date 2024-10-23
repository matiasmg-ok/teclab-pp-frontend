import { Product } from "../../types/Product"
import { unloggedClient, useUnloggedClient } from "../../utils/unloggedClient"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard";

export default function ProductList() {

  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization');
  
  const url = new URLSearchParams(window.location.search);
  
  const [{ data }] = useUnloggedClient<Product[]>(url.get('search') ? `/products?search=${url.get('search')}` : '/products');
  const [search, setSearch] = useState<string>(url.get('search') || '');

  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    if (!data) return;
    setProducts(data);
  }, [data])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await unloggedClient.get<Product[]>('/products?search=' + search);
    setProducts(res.data);
  }

  if (!data) return <>Cargando...</>

  if (!cotization) return <>Cargando...</>

  return <div className="text-black dark:text-white">
    <h2 className="text-3xl font-roboto text-center mb-5 font-medium">Productos</h2>
    <form onClick={handleSearch} className="w-[40rem] mx-auto flex">
      <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar..." className={'py-2 px-4 font-roboto border-2 bg-white dark:bg-slate-800 dark:border-blue-900 border-blue-200 w-full outline-blue-400'} />
      <button className={'bg-blue-400 dark:bg-slate-800 px-10 font-roboto text-white hover:bg-blue-500 transition-all'}>Buscar</button>
    </form>
    <div className="flex flex-wrap gap-2 self-start w-full md:px-20">
      {
        products && products.map(product => <ProductCard key={product.id} product={product} cotization={cotization.price} />)
      }
    </div>
  </div>
}