import { MdAdd, MdDelete, MdError, MdPerson } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/Button";
import { useClient } from "../../utils/loggedClient";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { client as loggedClient } from "../../utils/loggedClient";
import MessageModal from "../../components/modals/MessageModal";
import { User } from "../../types/User";

export default function AdminUsers() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: users }] = useClient('/users');
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
      <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white'}>Usuarios</h1>
      <div className="flex gap-4 flex-wrap mt-4">
        {
          users && users.map((user: User) => <div className="min-w-[24rem] text-black dark:text-white min-h-[7rem] flex items-center justify-between border-2 border-blue-200 dark:border-slate-500 rounded-lg px-4 py-2">
            <div className="flex items-center">
              <div className="w-[4rem] h-[4rem] bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <MdPerson size={28} className="text-blue-400 dark:text-slate-400 transition-all" />
              </div>
              <div className="pl-5">
                <p className="flex items-center gap-2">{user.name} <div className={`${user.profile === 'admin' ? 'bg-red-400' : 'bg-blue-400'} px-2 rounded-full`}>{user.profile === 'admin' ? 'Admin' : 'Cliente'}</div> </p>
                <p className="italic text-gray-400">{user.email}</p>
              </div>
            </div>
            <button className="relative right-0" onClick={() => setDeletingId(user.id)}>
              <MdDelete size={28} className="text-blue-400 dark:text-slate-500 cursor-pointer hover:text-blue-500 hover:dark:text-slate-200 transition-all" />
            </button>
          </div>)
        }
      </div>
    </div>
  </AdminLayout>

}