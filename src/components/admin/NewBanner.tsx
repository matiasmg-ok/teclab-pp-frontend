import { MdAdd, MdCancel, MdError, MdPhoto, MdSafetyCheck, MdTextFields, MdTypeSpecimen } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/Button";
import { useClient, client } from "../../utils/loggedClient";
import AdminInput from "./AdminInput";
import { BiDollar } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState } from "react";
import AdminTextarea from "./AdminTextarea";
import ConfirmationModal from "../modals/ConfirmationModal";
import MessageModal from "../modals/MessageModal";

export default function NewBanner() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [requesting, setRequesting] = useState(false);

  const [bannerData, setBannerData] = useState({
    title: "",
    redirectUrl: "",
    image: new File([], "")
  });

  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }


  const onFileChange = (e: any) => {
    setBannerData((prev) => ({ ...prev, image: e.target.files[0] }));
  }

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bannerData.title || !bannerData.redirectUrl || !bannerData.image) {
      return setErrorMessage('Todos los campos son obligatorios');
    }

    setRequesting(true);
  }

  const createProduct = async () => {
    const formData = new FormData();

    formData.append('title', bannerData.title);
    formData.append('redirectUrl', bannerData.redirectUrl);
    formData.append('image', bannerData.image);

    const res = await client.post('/advertisements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 201) {
      return window.location.href = '/admin/advertisements';
    }
    setErrorMessage('Error al crear el producto');
  }

  return <AdminLayout user={user}>
    {
      requesting &&
      <ConfirmationModal
        verificationMethod={"random_code"}
        Icon={MdSafetyCheck}
        title={"¿Seguro que quieres crear este producto?"}
        onConfirm={() => {
          setRequesting(false);
          createProduct();
        }}
        onCancel={() => {
          setRequesting(false);
        }}
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
      <div className="flex flex-col gap-4">
        <form onSubmit={submitProduct} className="flex flex-col gap-2 items-center text-black dark:text-white">
          <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white mb-5'}>Nuevo banner/anuncio</h1>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Nombre</label>
            <AdminInput props={{
              type: 'text',
              placeholder: 'Descuento semanal...',
              onChange: e => {
                setBannerData((prev) => ({ ...prev, title: e.target.value }));
              },
              value: bannerData.title
            }} Icon={MdTextFields} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>URL de redirección</label>
            <AdminInput props={{
              type: 'text',
              placeholder: 'https://...',
              onChange: e => {
                setBannerData((prev) => ({ ...prev, redirectUrl: e.target.value }));
              },
              value: bannerData.redirectUrl
            }} Icon={MdTypeSpecimen} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Imagen</label>
            <AdminInput props={{
              type: 'file',
              accept: 'image/*',
              onChange: e => onFileChange(e)
            }} Icon={MdPhoto} />
          </div>
          <div className="flex gap-4 mt-10">
            <Link to="/admin/advertisements">
              <Button> <MdCancel size={24} /> Cancelar</Button>
            </Link>
            <Button> <MdAdd size={24} /> Publicar</Button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>

}