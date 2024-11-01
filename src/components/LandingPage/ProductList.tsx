import { Product } from "../../types/Product"
import { unloggedClient, useUnloggedClient } from "../../utils/unloggedClient"
import { useEffect, useState } from "react"
import ProductCard from "./ProductCard";
import { MdSearch } from "react-icons/md";
import Input from "../Input";
import Button from "../Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function generateSearchUrl({ search, minPrice, maxPrice }: { search?: string | null, minPrice?: string | null, maxPrice?: string | null }) {
  let url = '/products?1=1';
  if (search) url += `&search=${search}`;
  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  return url;
}

export default function ProductList() {

  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization');

  const url = new URLSearchParams(window.location.search);
  let searchUrl = generateSearchUrl({ search: url.get('search'), minPrice: url.get('minPrice'), maxPrice: url.get('maxPrice') });
  const [{ data }] = useUnloggedClient<Product[]>(searchUrl);
  const [search, setSearch] = useState<string>(url.get('search') || '');
  const [filters, setFilters] = useState<{ minPrice: string, maxPrice: string }>({ minPrice: url.get('minPrice') || '', maxPrice: url.get('maxPrice') || '' });

  const [products, setProducts] = useState<Product[]>();
  const [mobileMenuDeployed, setMobileMenuDeployed] = useState<boolean>(false);

  useEffect(() => {
    if (!data) return;
    setProducts(data);
  }, [data])

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await unloggedClient.get<Product[]>(generateSearchUrl({ search, minPrice: filters.minPrice, maxPrice: filters.maxPrice }));
    setProducts(res.data);
  }

  async function refreshProducts() {
    const res = await unloggedClient.get<Product[]>(generateSearchUrl({ search, minPrice: filters.minPrice, maxPrice: filters.maxPrice }));
    setProducts(res.data);
  }

  if (!data) return <>Cargando...</>

  if (!cotization) return <>Cargando...</>

  return <div className="text-black dark:text-white">
    <h2 className="text-3xl font-roboto text-center mb-5 font-medium">Productos</h2>
    <form onClick={handleSearch} className="md:w-[40rem] mx-auto flex">
      <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar..." className={'py-2 px-4 font-roboto border-2 bg-white dark:bg-slate-800 dark:border-blue-900 border-blue-200 w-full outline-blue-400'} />
      <button className={'bg-blue-400 dark:bg-slate-800 px-5 md:px-10 font-roboto text-white hover:bg-blue-500 transition-all'}>
        <span className={'hidden md:inline'}>Buscar</span>
        <span className={'inline md:hidden'}> <MdSearch size={20} /> </span>
      </button>
    </form>
    <div className="flex flex-col md:flex-row w-full md:px-20 mt-5">
      <div className="flex flex-col items-center md:w-[20rem]">
        <h2 className="hidden md:inline text-3xl font-roboto text-center mb-5 font-medium">Filtros</h2>
        <div onClick={() => setMobileMenuDeployed(!mobileMenuDeployed)} className="flex md:hidden items-center justify-between py-4 bg-blue-200 dark:bg-slate-700 w-full px-10">
          <p className="text-lg font-semibold font-roboto">Filtros</p>
          {
            !mobileMenuDeployed ?
              <IoIosArrowDown size={20} />
              :
              <IoIosArrowUp size={20} />
          }
        </div>
        <div className={`flex-col w-full md:flex ${mobileMenuDeployed ? 'flex' : 'hidden'} bg-blue-200 dark:bg-slate-700 md:bg-transparent pb-4 md:pb-0 md:dark:bg-transparent items-center`}>
          <div className={'flex flex-col'}>
            <p>Precio mínimo (USD)</p>
            <Input props={{ type: 'number', min: 0, placeholder: '0', value: filters.minPrice, onChange: (e) => setFilters(prev => ({ ...prev, minPrice: e.target.value })) }} />
          </div>
          <div className={'flex flex-col'}>
            <p>Precio máximo (USD)</p>
            <Input props={{ type: 'number', min: 0, placeholder: '0', value: filters.maxPrice, onChange: (e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value })) }} />
          </div>
          <div className="mt-5">
            <Button onClick={refreshProducts}>Aplicar filtros</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start md:self-start w-full">
        {
          products && products.map(product => <ProductCard key={product.id} product={product} cotization={cotization.price} />)
        }
      </div>
    </div>
  </div>
}