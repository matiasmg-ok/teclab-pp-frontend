import { MdError, MdInfo, MdLocalShipping, MdPayment } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import { client, useClient } from "../../utils/loggedClient";
import { Order } from "../../types/Order";
import { PopupContent } from "../../types/PopupContent";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MessageModal from "../../components/modals/MessageModal";
import Button from "../../components/Button";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { RequestingContent } from "../../types/RequestingContent";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const status = {
  'payment-pending': 'Pago pendiente de confirmación',
  'payment-completed': 'Pagado',
  'in-progress': 'En preparación',
  'shipping': 'En camino',
  'finished': 'Entregado/Finalizado',
  'cancelled': 'Cancelado'
}
function OrderCard({ order, setPopupContent, setRequesting }: { order: Order, setPopupContent: React.Dispatch<React.SetStateAction<PopupContent>>, setRequesting: React.Dispatch<React.SetStateAction<RequestingContent>> }) {
  const product = order.products[0].product;


  return <>
    <div className={'flex flex-col lg:flex-row items-center w-full lg:w-[60rem] lg:min-h-[14rem] border-4 border-blue-200 dark:border-slate-800 rounded-lg'}>
      <img className="w-[10rem] h-[10rem] my-4 lg:w-[5rem] lg:h-[5rem] mx-10" src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
      <div className="py-2">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p>Comprado el {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Estado: {status[order.status]}</p>

        <p>Moneda elegida: {order.currency === 'usd' ? 'Dólar estadounidense' : 'Peso argentino'}</p>
        <p>Monto total: ${order.price}</p>
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-2">
          {
            order.status === 'shipping' && <>
              <Button onClick={() => {
                setRequesting({
                  title: '¿Deseas confirmar que ya se entregó este pedido?',
                  Icon: MdPayment,
                  action: async () => {
                    const res = await client.patch('/orders/' + order.id, { status: 'finished' });

                    if (res.status === 200) {
                      setPopupContent({
                        message: 'Entrega registrada con éxito. Recargando en 3 segundos...',
                        Icon: MdLocalShipping,
                        show: true,
                        hideAcceptButton: true
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 3000)
                    }
                  },
                  show: true
                });
              }}>Marcar como entregado</Button>
            </>
          }
          {
            order.status === 'payment-completed' && <>
              <Button onClick={() => {
                setRequesting({
                  title: '¿Deseas confirmar que ya despachaste este pedido?',
                  Icon: MdPayment,
                  action: async () => {
                    const res = await client.patch('/orders/' + order.id, { status: 'shipping' });

                    if (res.status === 200) {
                      setPopupContent({
                        message: 'Despacho registrado con éxito. Recargando en 3 segundos...',
                        Icon: MdLocalShipping,
                        show: true,
                        hideAcceptButton: true
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 3000)
                    }
                  },
                  show: true
                });
              }}>Marcar como despachado</Button>
            </>
          }
          {
            order.status === 'payment-pending' && <>
              <Button onClick={() => {
                setRequesting({
                  title: '¿Deseas confirmar que este usuario ya realizó el pago?',
                  Icon: MdPayment,
                  action: async () => {
                    const res = await client.patch('/orders/' + order.id, { status: 'payment-completed' });

                    if (res.status === 200) {
                      setPopupContent({
                        message: 'Pago registrado con éxito. Recargando en 3 segundos...',
                        Icon: MdPayment,
                        show: true,
                        hideAcceptButton: true
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 3000)
                    }
                  },
                  show: true
                });
              }}>Marcar como pagado</Button>
            </>
          }
          <Button onClick={() => {
            setPopupContent({
              message: `
              Nombre completo: ${order.user?.name}
              Correo electrónico: ${order.user?.email}
                  `,
              Icon: MdInfo,
              show: true,
              hideAcceptButton: false
            });
          }}>Datos del usuario</Button>
          <Button onClick={() => {
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
          }}>Datos de envío</Button>
          {
            order.status !== 'cancelled' && order.status !== 'finished' && <Button onClick={() => {
              setRequesting({
                title: '¿Seguro que quieres cancelar este pedido?',
                Icon: MdLocalShipping,
                action: async () => {
                  const res = await client.patch('/orders/' + order.id, { status: 'cancelled' });
                  if (res.status === 200) {
                    setPopupContent({
                      message: 'La compra ha sido cancelada, recargando en 3 segundos...',
                      Icon: MdLocalShipping,
                      show: true,
                      hideAcceptButton: true
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 3000)
                  }
                },
                show: true
              })
            }}>Cancelar pedido</Button>
          }

        </div>
      </div>
    </div>
  </>
}

function StatusFilterElement({ setFilters, filters, filterId }: { setFilters: Dispatch<SetStateAction<FiltersType>>, filters: FiltersType, filterId: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled' | null }) {
  return (
    <>
      <div onClick={() => setFilters(prev => ({ ...prev, status: filterId }))} className={`flex rounded-full gap-2 border-2 py-2 px-2 bg-gray-50 dark:bg-slate-800 cursor-pointer items-center ${filters.status === filterId ? 'border-blue-400' : 'border-blue-100'}`}>
        <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${filters.status === filterId ? 'bg-blue-400 dark:bg-blue-700' : 'bg-blue-200'}`}></div>
        <p>{(filterId && status[filterId]) || 'Sin filtro'}</p>
      </div>
    </>
  )
}

type FiltersType = {
  status?: 'payment-pending' | 'payment-completed' | 'in-progress' | 'shipping' | 'finished' | 'cancelled' | null,
  currency?: 'usd' | 'ars' | null
}

function generateSearchUrl({ status, currency }: FiltersType) {
  let url = '/orders?1=1';
  if (status) url += `&status=${status}`;
  if (currency) url += `&currency=${currency}`;
  return url;
}

export default function AdminOrders() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: ordersData }] = useClient('/orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<FiltersType>({ status: null, currency: null });

  useEffect(() => {
    setOrders(ordersData);
  }, [ordersData]);

  const [popupContent, setPopupContent] = useState<PopupContent>({
    message: '',
    Icon: null,
    show: false,
    hideAcceptButton: false
  })

  const [requesting, setRequesting] = useState<RequestingContent>({
    title: '',
    Icon: null,
    action: () => { },
    show: false
  })

  const [mobileMenuDeployed, setMobileMenuDeployed] = useState<boolean>(false);


  async function refreshOrders() {
    const res = await client.get(generateSearchUrl({ currency: filters.currency, status: filters.status }));

    if (res.status === 200) {
      return setOrders(res.data);
    }

    setPopupContent({
      message: res.data.message,
      Icon: MdError,
      show: true,
      hideAcceptButton: false
    })
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return user && orders && <AdminLayout user={user}>
    {
      popupContent.show && <MessageModal
        message={popupContent.message}
        Icon={popupContent.Icon}
        onConfirm={() => setPopupContent((prev) => ({ ...prev, show: false }))}
        hideAcceptButton={popupContent.hideAcceptButton}
      />
    }

    {
      requesting.show &&
      <ConfirmationModal
        verificationMethod={"random_code"}
        Icon={requesting.Icon}
        title={requesting.title}
        onConfirm={() => {
          setRequesting(prev => ({ ...prev, show: false }));
          requesting.action();
        }}
        onCancel={() => {
          setRequesting(prev => ({ ...prev, show: false }));
        }}
      />
    }

    <div className="flex flex-col lg:flex-row items-start gap-2 py-4 px-4 text-black dark:text-white">
      <div className="flex flex-col w-full items-center lg:w-[20rem]">
        <h1 className={'text-4xl self-start mb-4 font-roboto font-medium text-black dark:text-white'}>Pedidos</h1>
        <div onClick={() => setMobileMenuDeployed(!mobileMenuDeployed)} className="flex lg:hidden items-center justify-between py-4 bg-blue-200 dark:bg-slate-700 w-full px-10">
          <p className="text-lg font-semibold font-roboto">Filtros</p>
          {
            !mobileMenuDeployed ?
              <IoIosArrowDown size={20} />
              :
              <IoIosArrowUp size={20} />
          }
        </div>
        <div className={`flex-col w-full gap-4 lg:flex ${mobileMenuDeployed ? 'flex' : 'hidden'} bg-blue-200 dark:bg-slate-700 lg:bg-transparent pb-4 lg:pb-0 lg:dark:bg-transparent items-center`}>
          <div className={'flex flex-col gap-2'}>
            <p className="text-lg text-center mb-2">Moneda de pago</p>
            <div className="flex flex-col gap-2">
              <div onClick={() => setFilters(prev => ({ ...prev, currency: 'usd' }))} className={`flex rounded-full gap-1 border-2 py-2 px-2 bg-gray-50 dark:bg-slate-800 cursor-pointer items-center ${filters.currency === 'usd' ? 'border-blue-400' : 'border-blue-100'}`}>
                <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${filters.currency === 'usd' ? 'bg-blue-400 dark:bg-blue-700' : 'bg-blue-200'}`}></div>
                <p><span className="text-sm font-bold bg-blue-200 dark:bg-blue-700 p-1 px-4 rounded-full">USD</span> Dólar estadounidense</p>
              </div>
              <div onClick={() => setFilters(prev => ({ ...prev, currency: 'ars' }))} className={`flex rounded-full gap-1 border-2 py-2 px-2 bg-gray-50 dark:bg-slate-800 cursor-pointer items-center ${filters.currency === 'ars' ? 'border-blue-400' : 'border-blue-100'}`}>
                <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${filters.currency === 'ars' ? 'bg-blue-400 dark:bg-blue-700' : 'bg-blue-200'}`}></div>
                <p><span className="text-sm font-bold bg-blue-200 dark:bg-blue-700 p-1 px-4 rounded-full">ARS</span> Peso argentino</p>
              </div>
              <div onClick={() => setFilters(prev => ({ ...prev, currency: null }))} className={`flex rounded-full gap-1 border-2 py-2 px-2 bg-gray-50 dark:bg-slate-800 cursor-pointer items-center ${filters.currency === null ? 'border-blue-400' : 'border-blue-100'}`}>
                <div className={`w-[1.4rem] h-[1.4rem] rounded-full ${filters.currency === null ? 'bg-blue-400 dark:bg-blue-700' : 'bg-blue-200'}`}></div>
                <p><span className="text-sm font-bold bg-blue-200 dark:bg-blue-700 p-1 px-4 rounded-full">ALL</span> Sin filtro</p>
              </div>
            </div>
            <div className={'flex flex-col'}>
              <p className="text-lg text-center mb-2">Estado del pedido</p>
              <div className="flex flex-col gap-2">
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'payment-pending'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'payment-completed'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'in-progress'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'shipping'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'finished'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={'cancelled'} />
                <StatusFilterElement setFilters={setFilters} filters={filters} filterId={null} />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Button onClick={refreshOrders}>Aplicar filtros</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-min lg:max-h-[80rem] gap-2 overflow-y-auto">
        {
          orders.map((order: Order) => {
            return <OrderCard key={order.id} order={order} setRequesting={setRequesting} setPopupContent={setPopupContent} />
          })
        }
      </div>
    </div>
  </AdminLayout>

}