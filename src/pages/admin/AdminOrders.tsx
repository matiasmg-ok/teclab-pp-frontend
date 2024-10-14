import { MdInfo, MdLocalShipping, MdPayment } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import { client, useClient } from "../../utils/loggedClient";
import { Order } from "../../types/Order";
import { PopupContent } from "../../types/PopupContent";
import { useState } from "react";
import MessageModal from "../../components/modals/MessageModal";
import Button from "../../components/Button";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { RequestingContent } from "../../types/RequestingContent";

function OrderCard({ order, setPopupContent, setRequesting }: { order: Order, setPopupContent: React.Dispatch<React.SetStateAction<PopupContent>>, setRequesting: React.Dispatch<React.SetStateAction<RequestingContent>> }) {
  const product = order.products[0].product;

  const status = {
    'payment-pending': 'Pago pendiente de confirmación',
    'payment-completed': 'Pagado',
    'in-progress': 'En preparación',
    'shipping': 'En camino',
    'finished': 'Entregado/Finalizado',
    'cancelled': 'Cancelado'
  }

  return <>
    <div className={'flex items-center w-[60rem] min-h-[11rem] border-4 border-blue-200 dark:border-slate-800 rounded-lg'}>
      <img className="w-[5rem] h-[5rem] mx-10" src={`${import.meta.env.VITE_BACKEND_URL}/${product.imageUrl}`} alt={product.name} />
      <div className="py-2">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p>Comprado el {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Estado: {status[order.status]}</p>

        <p>Moneda elegida: {order.currency === 'usd' ? 'Dólar estadounidense' : 'Peso argentino'}</p>
        <p>Monto total: ${order.price}</p>
        <div className="flex items-center gap-2 mt-2">
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

export default function AdminOrders() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: orders }] = useClient('/orders')

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

    <div className="flex flex-col gap-2 py-4 px-4 text-black dark:text-white">
      <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white'}>Pedidos</h1>
      {
        orders.map((order: Order) => {
          return <OrderCard key={order.id} order={order} setRequesting={setRequesting} setPopupContent={setPopupContent} />
        })
      }
    </div>
  </AdminLayout>

}