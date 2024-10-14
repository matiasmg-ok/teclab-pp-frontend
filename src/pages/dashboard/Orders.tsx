import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Order } from "../../types/Order";
import { useClient } from "../../utils/loggedClient";

const status = {
  'payment-pending': 'Pago pendiente de confirmación',
  'payment-completed': 'Pagado',
  'in-progress': 'En proceso',
  'shipping': 'Enviado',
  'finished': 'Finalizado',
  'cancelled': 'Cancelado'
}

function OrderCard({ order }: { order: Order }) {

  const product = order.products[0].product;

  return <>
    <div className={'flex items-center w-6/12 min-h-[15rem] border-4 border-blue-200'}>
      <img className="w-[10rem] h-[10rem] mx-10" src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
      <div className="self-start mt-10">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p>Comprado el {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Estado: {status[order.status]}</p>
        <p>Código de tracking: {order.trackingCode}</p>
        {
          order.status === 'payment-pending' && <>
            <p>Moneda elegida: {order.currency === 'usd' ? 'Dólar estadounidense' : 'Peso argentino'}</p>
            <p>Monto total: ${order.price}</p>
            <button onClick={()=>{}} className="w-[12rem] py-1 px-2 bg-blue-400 rounded-sm text-white mt-5 font-medium text-md hover:bg-blue-500 transition-all">Ver datos para pagar</button>
          </>
        }
      </div>
    </div>
  </>
}

export default function Orders() {

  const [{ data: user }] = useClient('/users/whoami');
  const [{ data: orders }] = useClient<Order[]>('/orders/self');

  return user && orders && <>
    <Navbar />
    <div className="font-roboto">
      <h1 className="text-2xl font-semibold text-center">Mis compras</h1>
      <div className="flex flex-col items-center mt-10">
        {
          orders.map((order) => {
            return <OrderCard key={order.id} order={order} />
          })
        }
      </div>
    </div>
    <Footer />
  </>
}