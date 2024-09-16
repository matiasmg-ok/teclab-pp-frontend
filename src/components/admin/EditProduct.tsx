import { MdCancel, MdDelete, MdPhoto, MdSave, MdTextFields, MdTypeSpecimen } from "react-icons/md";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/Button";
import { useClient, client } from "../../utils/loggedClient";
import AdminInput from "./AdminInput";
import { BiDollar } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminTextarea from "./AdminTextarea";

export default function EditProduct() {

  const query = new URLSearchParams(window.location.search);
  const id = query.get('id');

  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: product, response: productRes }] = useClient(`/products/${id}`);

  const [productData, setProductData] = useState({
    name: product?.name,
    group: product?.group,
    description: product?.description,
    price: product?.price,
    image: new File([], "")
  });

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name || '',
        group: product.group || '',
        description: product.description || '',
        price: product.price || '',
        image: new File([], "")
      });
    }
  }, [product]);

  if (loading) {
    return <p>Cargando...</p>
  }

  if (productRes?.status === 404) {
    window.location.href = '/admin/products';
  }

  if (error) {
    return <p>{error.message}</p>
  }

  const onFileChange = (e: any) => {
    setProductData((prev) => ({ ...prev, image: e.target.files[0] }));
  }

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productData.name || !productData.group || !productData.description || !productData.price || !productData.image) {
      return alert('Todos los campos son obligatorios');
    }

    const code = Math.floor(Math.random() * 10000)

    const propmtRes = prompt(`Esto va a sobreescribir el producto, si estás seguro de actualizarlo escribe el siguiente código: ${code}`);

    if(Number(propmtRes) !== code) {
      return alert("Código incorrecto. No se ha actualizado el producto.");
    }

    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('group', productData.group);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    if (productData.name !== '') {
      formData.append('image', productData.image);
    }

    const res = await client.put('/products/' + product.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      return window.location.href = '/admin/products';
    }
    alert('Error al actualizar el producto');
  }

  const deleteProduct = async () => {

    const code = Math.floor(Math.random() * 10000)

    const propmtRes = prompt(`Para confirmar eliminación, escribe el siguiente código: ${code}`);

    if(Number(propmtRes) !== code) {
      return alert("Código incorrecto. No se ha eliminado el producto.");
    }

    const res = await client.delete('/products/' + product.id);
    if (res.status === 200) {
      return window.location.href = '/admin/products';
    }
    alert('Error al eliminar el producto');
  }

  return <>
    {
      product &&
      <AdminLayout user={user}>
        <div className="flex flex-col gap-2 py-4 px-4">
          <div className="flex flex-col gap-4">
            <form onSubmit={saveProduct} className="flex flex-col gap-2 items-center">
              <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white mb-5'}>Nuevo producto</h1>
              <div className="flex flex-col gap-2 w-[19rem]">
                <label>
                  Nombre
                  <span className={`ml-1 text-slate-400 ${product.name !== productData.name ? 'inline-block' : 'hidden'}`}>(Editado)</span>
                </label>
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
                <label>
                  Grupo
                  <span className={`ml-1 text-slate-400 ${product.group !== productData.group ? 'inline-block' : 'hidden'}`}>(Editado)</span>
                </label>
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
                <label>
                  Descripción
                  <span className={`ml-1 text-slate-400 ${product.description !== productData.description ? 'inline-block' : 'hidden'}`}>(Editado)</span>
                </label>
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
                <label>
                  Precio
                  <span className={`ml-1 text-slate-400 ${Number(product.price) !== Number(productData.price) ? 'inline-block' : 'hidden'}`}>(Editado)</span>
                </label>
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
                <label>
                  Foto
                  <span className={`ml-1 text-slate-400 ${productData.image.name !== '' ? 'inline-block' : 'hidden'}`}>(Editado)</span>
                </label>
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
                <Button type="reset" onClick={deleteProduct}> <MdDelete size={24} /> Eliminar</Button>
                <Button type="submit"> <MdSave size={24} /> Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    }
  </>
}