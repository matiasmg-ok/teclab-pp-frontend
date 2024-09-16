import { Product } from "../../types/Product";
import { useUnloggedClient } from "../../utils/unloggedClient";

function ProductCard({ product, cotization }: { product: Product, cotization: number }) {
  return <div className="font-roboto w-[14rem] h-[21rem] bg-blue-200 mt-4 flex flex-col items-center">
    <img className={'w-[12rem] h-[15rem] object-cover py-4'} src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
    <div className="self-start px-4">
      <p>{product.group}</p>
      <h1 className={'font-medium text-lg'}>{product.name}</h1>
    </div>
    <div className="flex px-4 justify-between py-2 w-full">
      {
        cotization > 0 &&
        <p className="text-lg">${(product.price * cotization).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
      }
      <p className="text-lg font-bold">US${Number(product.price)}</p>
    </div>
  </div>
}

export default function FeaturedProducts() {

  const [{ data: products }] = useUnloggedClient<Product[]>('/products')
  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization')

  return <>
    {
      products && <div className="flex flex-col py-5">
        <h2 className="text-3xl font-roboto text-center">Novedades</h2>
        <div className="flex gap-4 items-center justify-center">
          {products?.map((product, idx) => {
            if (idx > 5) return;
            return <ProductCard key={product.id} product={product} cotization={cotization?.price || 0} />;
          })}
        </div>
      </div>
    }
  </>
}