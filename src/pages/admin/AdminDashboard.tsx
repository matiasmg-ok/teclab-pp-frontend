import AdminLayout from "../../components/admin/AdminLayout";
import { useClient } from "../../utils/loggedClient";

export default function AdminDashboard() {
  const [{ data: user, loading, error }] = useClient('/users/whoami')

  if(loading) {
    return <p>Cargando...</p>
  }

  if(error) {
    return <p>{error.message}</p>
  }

  return <AdminLayout user={user}>
    <h1>Hola, {user.name}</h1>
  </AdminLayout>

}