import { useState } from "react";
import Footer from "../../components/Footer";
import MessageModal from "../../components/modals/MessageModal";
import Navbar from "../../components/Navbar";
import { Order } from "../../types/Order";
import { useClient } from "../../utils/loggedClient";
import { PopupContent } from "../../types/PopupContent";
import { MdLocalShipping, MdPayment } from "react-icons/md";

const status = {
  'payment-pending': 'Pago pendiente de confirmación',
  'payment-completed': 'Pagado',
  'in-progress': 'En preparación',
  'shipping': 'En camino',
  'finished': 'Finalizado',
  'cancelled': 'Cancelado'
}

function OrderCard({ order, setPopupContent }: { order: Order, setPopupContent: React.Dispatch<React.SetStateAction<PopupContent>> }) {

  const product = order.products[0].product;

  return <>
    <div className={'flex items-center w-6/12 min-h-[15rem] border-4 border-blue-200'}>
      <img className="w-[10rem] h-[10rem] mx-10" src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
      <div className="">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p>Comprado el {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Estado: {status[order.status]}</p>

        <p>Moneda elegida: {order.currency === 'usd' ? 'Dólar estadounidense' : 'Peso argentino'}</p>
        <p>Monto total: ${order.price}</p>
        <div className="flex items-center gap-2">
          {
            order.status === 'payment-pending' && <>
              <button onClick={() => {
                setPopupContent({
                  message: order.currency === 'usd' ? 'CBU (Dólares): 0000000000000000000\nBanco: BBVA\nCuenta: 000000000\n\nSi ya realizaste el pago, espera a que sea confirmado.\nPara acelerar la comprobación, envía comprobante de transferencia\n a WhatsApp: +54 000 0000000' : 'CBU (Pesos Argentinos): 0000000000000000000\nBanco: BBVA\nCuenta: 000000000\n\nSi ya realizaste el pago, espera a que sea confirmado.\nPara acelerar la comprobación, envía comprobante de transferencia\n a WhatsApp: +54 000 0000000',
                  Icon: MdPayment,
                  show: true,
                  hideAcceptButton: false
                });
              }} className="w-[12rem] py-1 px-2 bg-blue-400 rounded-sm text-white mt-5 font-medium text-md hover:bg-blue-500 transition-all">Ver datos para pagar</button>
            </>
          }
          <button onClick={() => {
            setPopupContent({
              message: `
                  Provincia: ${order.province}
                  Ciudad/Localidad: ${order.city}
                  Dirección de envío: ${order.shippingAddress}
                  Código postal: ${order.zip}
                  `,
              Icon: MdLocalShipping,
              show: true,
              hideAcceptButton: false
            });
          }} className="w-[12rem] py-1 px-2 bg-blue-400 rounded-sm text-white mt-5 font-medium text-md hover:bg-blue-500 transition-all">Información de envío</button>
        </div>
      </div>
    </div>
  </>
}

export default function Orders() {

  const [{ data: user }] = useClient('/users/whoami');
  const [{ data: orders }] = useClient<Order[]>('/orders/self');

  const [popupContent, setPopupContent] = useState<PopupContent>({
    message: '',
    Icon: null,
    show: false,
    hideAcceptButton: false
  })

  return user && orders && <>
    <Navbar />

    {
      popupContent.show && <MessageModal
        message={popupContent.message}
        Icon={popupContent.Icon}
        onConfirm={() => setPopupContent((prev) => ({ ...prev, show: false }))}
        hideAcceptButton={popupContent.hideAcceptButton}
      />
    }

    <div className="font-roboto">
      <h1 className="text-2xl font-semibold text-center">Mis compras</h1>
      <div className="flex flex-col items-center mt-10 gap-2">
        {
          orders.map((order) => {
            return <OrderCard setPopupContent={setPopupContent} key={order.id} order={order} />
          })
        }
      </div>
    </div>
    <Footer />
  </>
}