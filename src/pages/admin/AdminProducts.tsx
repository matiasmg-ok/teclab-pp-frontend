import AdminLayout from "../../components/admin/AdminLayout";
import AdminProductCard from "../../components/admin/AdminProductCard";
import { Product } from "../../types/Product";
import { useClient } from "../../utils/loggedClient";

export default function AdminProducts() {
  const [{ data: user, loading, error }] = useClient('/users/whoami');
  const [{ data: products }] = useClient('/products')

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return <AdminLayout user={user}>
    <div className="flex flex-col gap-2 py-4 px-4">
      <h1 className={'text-4xl font-roboto font-medium text-black dark:text-white'}>Productos</h1>
      <div className="flex flex-col gap-4">
        {products && products.map((product: Product) => <AdminProductCard key={product.id} product={product} />)}
      </div>
    </div>
  </AdminLayout>

}