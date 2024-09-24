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

export default function NewProduct() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [requesting, setRequesting] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    group: "",
    description: "",
    price: 0,
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
    setProductData((prev) => ({ ...prev, image: e.target.files[0] }));
  }

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productData.name || !productData.group || !productData.description || !productData.price || !productData.image) {
      return setErrorMessage('Todos los campos son obligatorios');
    }

    setRequesting(true);
  }

  const createProduct = async () => {
    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('group', productData.group);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('image', productData.image);

    const res = await client.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 201) {
      return window.location.href = '/admin/products';
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
          <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white mb-5'}>Nuevo producto</h1>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Nombre</label>
            <AdminInput props={{
              type: 'text',
              placeholder: 'Apple Watch...',
              onChange: e => {
                setProductData((prev) => ({ ...prev, name: e.target.value }));
              },
              value: productData.name
            }} Icon={MdTextFields} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Grupo</label>
            <AdminInput props={{
              type: 'text',
              placeholder: 'Smartwatch...',
              onChange: e => {
                setProductData((prev) => ({ ...prev, group: e.target.value }));
              },
              value: productData.group
            }} Icon={MdTypeSpecimen} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Descripción</label>
            <AdminTextarea props={{
              type: 'text',
              placeholder: 'Producto de Apple...',
              onChange: e => {
                setProductData((prev) => ({ ...prev, description: e.target.value }));
              },
              value: productData.description
            }} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Precio</label>
            <AdminInput props={{
              type: 'text',
              placeholder: '249',
              onChange: e => {
                if (isNaN(Number(e.target.value))) return;
                setProductData((prev) => ({ ...prev, price: Number(e.target.value) }));
              },
              value: productData.price
            }} Icon={BiDollar} />
          </div>
          <div className="flex flex-col gap-2 w-[19rem]">
            <label>Foto</label>
            <AdminInput props={{
              type: 'file',
              accept: 'image/*',
              onChange: e => onFileChange(e)
            }} Icon={MdPhoto} />
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