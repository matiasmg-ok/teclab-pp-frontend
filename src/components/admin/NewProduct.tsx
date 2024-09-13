import { MdAdd, MdCancel, MdDescription, MdPhoto, MdTextFields, MdTypeSpecimen } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/Button";
import { useClient } from "../../utils/loggedClient";
import AdminInput from "./AdminInput";
import { BiDollar } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function NewProduct() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return <AdminLayout user={user}>
    <div className="flex flex-col gap-2 py-4 px-4">
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-2 items-center">
          <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white mb-5'}>Nuevo producto</h1>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Nombre del producto</label>
            <AdminInput props={{ type: 'text', placeholder: 'Apple Watch...' }} Icon={MdTextFields} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Grupo/Tipo de producto</label>
            <AdminInput props={{ type: 'text', placeholder: 'Smartwatch...' }} Icon={MdTypeSpecimen} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Descripción corta</label>
            <AdminInput props={{ type: 'text', placeholder: 'Producto de Apple...' }} Icon={MdDescription} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Precio del producto</label>
            <AdminInput props={{ type: 'text', placeholder: '249' }} Icon={BiDollar} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Foto</label>
            <AdminInput props={{ type: 'file', placeholder: '249' }} Icon={MdPhoto} />
          </div>
          <div className="flex gap-4 mt-10">
            <Link to="/admin/products">
              <Button> <MdCancel size={24} /> Cancelar</Button>
            </Link>
            <Button> <MdAdd size={24} /> Publicar</Button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>

}