import { Product } from "../../types/Product";
import { useUnloggedClient } from "../../utils/unloggedClient";
import ProductCard from "./ProductCard";



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