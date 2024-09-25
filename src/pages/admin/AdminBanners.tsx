import { MdAdd, MdDelete, MdError } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/Button";
import { useClient } from "../../utils/loggedClient";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { client as loggedClient } from "../../utils/loggedClient";
import MessageModal from "../../components/modals/MessageModal";

export default function AdminBanners() {
  // also known as "Advertisements"
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: advertisements }] = useClient('/advertisements');
  const [deletingId, setDeletingId] = useState<null | number>(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return <AdminLayout user={user}>
    {
      deletingId &&
      <ConfirmationModal
        title="¿Seguro que deseas eliminar este banner?"
        Icon={MdDelete}
        onConfirm={async () => {
          setDeletingId(null)
          const res = await loggedClient.delete(`/advertisements/${deletingId}`)
          if (res.status === 200) {
            return window.location.reload()
          }

        }}
        onCancel={() => {
          setDeletingId(null)
        }}
        verificationMethod="random_code"
      />
    }
    {
      errorMessage && <MessageModal
        message={errorMessage}
        Icon={MdError}
        onConfirm={() => setErrorMessage("")}
      />
    }
    <div className="flex flex-col gap-2 py-4 px-4">
      <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white'}>Banners</h1>
      <div className="flex">
        <Link to={'/admin/new-advertisement'}>
          <Button>
            <MdAdd size={24} />
            Añadir banner/anuncio
          </Button>
        </Link>
      </div>
      <div className="flex gap-4 flex-wrap mt-4">
        {
          advertisements && advertisements.map((advertisement: any) => <>
            <div className="w-[29rem] min-h-[9rem] group bg-blue-100 text-black dark:text-white dark:bg-slate-800 flex flex-col justify-between items-end px-5 py-2 rounded-lg  border-2 border-transparent  transition-all">
              <div className="flex w-full flex-col items-center justify-center py-2 gap-2">
                <div className="flex flex-col font-roboto px-5">
                  <h3 className={'text-xl font-semibold'}>{advertisement.title}</h3>
                </div>
                <img src={`${import.meta.env.VITE_BACKEND_URL}/${advertisement.imageUrl}`} className={'w-[100%] h-[7rem] bg-slate-500 rounded-lg object-cover'}></img>
              </div>
              <div onClick={() => setDeletingId(advertisement.id)}>
                <MdDelete size={28} className="text-slate-500 cursor-pointer hover:border-blue-400 hover:dark:text-slate-200 transition-all" />
              </div>
            </div>
          </>)
        }
      </div>
    </div>
  </AdminLayout>

}