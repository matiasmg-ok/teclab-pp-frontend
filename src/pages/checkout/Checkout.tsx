import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Product } from "../../types/Product";
import { useClient } from "../../utils/loggedClient";

export default function Checkout() {

  const [{ data: user }] = useClient('/users/whoami')

  if(!user) {
    window.location.href = '/login'
  }

  const productId = new URLSearchParams().get('productId')
  const [{ data: product }] = useClient<Product>(`/products/${productId}`)

  return <>
    <Navbar />
    <h1>Checkout</h1>
    <div>
      <div>
        {/* here comes the form */}
      </div>
      <div>
        {/* the preview of the product */}
      </div>
    </div>
    <Footer />
  </>
}