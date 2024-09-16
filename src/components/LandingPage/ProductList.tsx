import { Product } from "../../types/Product"
import { unloggedClient, useUnloggedClient } from "../../utils/unloggedClient"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard";

export default function ProductList() {

  const [{ data }] = useUnloggedClient<Product[]>('/products');
  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization');
  const [search, setSearch] = useState<string>('');

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

  return <>
    <h2 className="text-3xl font-roboto text-center mb-5 font-medium">Productos</h2>
    <form onClick={handleSearch} className="w-[40rem] mx-auto flex">
      <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar..." className={'py-2 px-4 font-roboto border-2 border-blue-200 w-full outline-blue-400'} />
      <button className={'bg-blue-400 px-10 font-roboto text-white hover:bg-blue-500 transition-all'}>Buscar</button>
    </form>
    <div className="flex flex-wrap gap-2 self-start w-full md:px-20">
      {
        products && products.map(product => <ProductCard key={product.id} product={product} cotization={cotization.price} />)
      }
    </div>
  </>
}