import { MdLocalShipping } from "react-icons/md";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Navbar from "../../components/Navbar";
import { Product } from "../../types/Product";
import { useClient } from "../../utils/loggedClient";
import { useUnloggedClient } from "../../utils/unloggedClient";

export default function Checkout() {

  const [{ data: user, loading }] = useClient('/users/whoami')

  if (!user && !loading) {
    window.location.href = '/login'
  }

  const productId = new URLSearchParams(window.location.search).get('productId')
  const [{ data: product, loading: productLoading }] = useClient<Product>(`/products/${productId}`)
  const [{ data: cotization }] = useUnloggedClient<{ price: number, updatedAt: string }>('/usd-cotization');

  if (!product && !productLoading) {
    window.location.href = '/'
  }

  return product && cotization && <>
    <Navbar />
    <h1 className={'text-center font-roboto text-4xl font-semibold'}>Checkout</h1>
    <div>
      <form className={'flex'}>
        <div className="flex flex-col gap-1">
          <p>Calle y número</p>
          <Input Icon={MdLocalShipping} props={{
            placeholder: 'Calle y número',
          }} />
        </div>
      </form>
      <div>
        <img src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
        <p>{product.name}</p>
        <p>{product.description}</p>
        <p>${product.price}</p>
        <p className="text-lg font-medium">AR${(product.price * cotization?.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <span className="italic text-sm">(TC: ${cotization?.price}/usd)</span></p>
      </div>
    </div>
    <Footer />
  </>
}