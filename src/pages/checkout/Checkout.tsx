import { MdCheck, MdError } from "react-icons/md";
import Footer from "../../components/Footer";
import Input from "../../components/Input";
import Navbar from "../../components/Navbar";
import { Product } from "../../types/Product";
import { client, useClient } from "../../utils/loggedClient";
import { useUnloggedClient } from "../../utils/unloggedClient";
import { useState } from "react";
import MessageModal from "../../components/modals/MessageModal";
import { IoMdClock } from "react-icons/io";
import { PopupContent } from "../../types/PopupContent";

type OrderData = {
  province: string
  city: string
  zip: string
  shippingAddress: string
}

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

  const [currency, setCurrency] = useState<'usd' | 'ars'>('usd')
  const [orderData, setOrderData] = useState<OrderData>({
    province: '',
    city: '',
    zip: '',
    shippingAddress: ''
  });

  const [popupContent, setPopupContent] = useState<PopupContent>({
    message: '',
    Icon: MdCheck,
    show: false,
    hideAcceptButton: true
  });

  async function createOrder() {

    if(!product){
      return;
    }

    if(!orderData.province || !orderData.city || !orderData.zip || !orderData.shippingAddress) {
      return setPopupContent({
        message: 'Todos los campos son obligatorios',
        Icon: MdError,
        show: true,
        hideAcceptButton: false
      });
    }

    setPopupContent({
      message: 'Estamos creando tu orden... \n Te redirecionaremos en unos instantes, no cierres esta página',
      Icon: IoMdClock,
      show: true,
      hideAcceptButton: true
    });

    const res = await client.post('/orders', {
      ...orderData,
      additionalNotes: '',
      productsIds: [product.id],
      currency: currency
    });

    if(res.status !== 201) {
      setPopupContent({
        message: 'Error al crear la orden, redireccionando a Inicio...',
        Icon: MdError,
        show: true,
        hideAcceptButton: false
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 3000)
    }

    if(res.status === 201) {
      return window.location.href = '/dashboard/orders';
    }

  }

  return product && cotization && <>
    <Navbar />
    {
      popupContent.show && <MessageModal
        message={popupContent.message}
        Icon={popupContent.Icon}
        onConfirm={() => setPopupContent((prev) => ({ ...prev, show: false }))}
        hideAcceptButton={popupContent.hideAcceptButton}
      />
    }
    <h1 className={'text-center font-roboto text-4xl font-semibold'}>Checkout</h1>
    <div className="flex flex-row-reverse w-full justify-center mt-10">
      <div className={'flex flex-col px-10 font-roboto'}>
        <div className="w-[15rem] flex flex-col gap-2">
          <div className="flex gap-1 items-center">
            <div className="flex flex-col gap-1">
              <p>Provincia</p>
              <Input props={{
                placeholder: 'Provincia',
                value: orderData.province,
                onChange: (e) => {
                  setOrderData((prev) => ({ ...prev, province: e.target.value }))
                }
              }} />
            </div>
            <div className="flex flex-col gap-1">
              <p>Localidad/Ciudad</p>
              <Input props={{
                placeholder: 'Localidad/Ciudad',
                value: orderData.city,
                onChange: (e) => {
                  setOrderData((prev) => ({ ...prev, city: e.target.value }))
                }
              }} />
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="flex flex-col gap-1">
              <p>Calle y número</p>
              <Input props={{
                placeholder: 'Calle y número',
                value: orderData.shippingAddress,
                onChange: (e) => {
                  setOrderData((prev) => ({ ...prev, shippingAddress: e.target.value }))
                }
              }} />
            </div>
            <div className="flex flex-col gap-1">
              <p>Código postal</p>
              <Input props={{
                placeholder: 'Código postal',
                value: orderData.zip,
                onChange: (e) => {
                  setOrderData((prev) => ({ ...prev, zip: e.target.value }))
                }
              }} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2 w-[18rem]">
          <p>Moneda a pagar</p>
          <div className="flex flex-col gap-2">
            <div onClick={() => setCurrency('usd')} className={`flex rounded-full gap-1 border-2 py-2 px-2 bg-gray-50 cursor-pointer items-center ${currency === 'usd' ? 'border-blue-400' : 'border-blue-100'}`}>
              <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${currency === 'usd' ? 'bg-blue-400' : 'bg-blue-200'}`}></div>
              <p><span className="text-sm font-bold bg-blue-200 p-1 px-4 rounded-full">USD</span> Dólar estadounidense</p>
            </div>
            <div onClick={() => setCurrency('ars')} className={`flex rounded-full gap-1 border-2 py-2 px-2 bg-gray-50 cursor-pointer items-center ${currency === 'ars' ? 'border-blue-400' : 'border-blue-100'}`}>
              <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${currency === 'ars' ? 'bg-blue-400' : 'bg-blue-200'}`}></div>
              <p><span className="text-sm font-bold bg-blue-200 p-1 px-4 rounded-full">ARS</span> Peso argentino</p>
            </div>
          </div>
        </div>
        <p className="italic text-sm mt-2 max-w-[28rem]">Todos los pagos se realizan con transferencia bancaria local argentina. Ya sea en dólares o pesos argentinos.</p>
        <div className="flex gap-2">
          <button onClick={() => {
            window.location.href = '/';
          }} className="w-[15rem] py-2 px-5 bg-blue-400 rounded-sm text-white mt-5 font-medium text-lg hover:bg-blue-500 transition-all">Cancelar</button>
          <button onClick={createOrder} className="w-[15rem] py-2 px-5 bg-blue-400 rounded-sm text-white mt-5 font-medium text-lg hover:bg-blue-500 transition-all">Pagar</button>
        </div>
      </div >
      <div className="border-4 rounded-lg p-4 border-blue-400 m-4">
        <img className="w-[20rem]" src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
        <p>{product.name}</p>
        <p className="text-lg font-medium">TOTAL USD ${Math.floor(product.price)}</p>
        <p className="text-lg font-medium">TOTAL ARS ${(product.price * cotization?.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <span className="italic text-sm">(TC: ${cotization?.price}/usd)</span></p>
      </div>
    </div >
    <Footer />
  </>
}