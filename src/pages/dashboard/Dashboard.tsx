import { useClient } from "../../utils/loggedClient";

export default function Dashboard() {
  const [{ data: user, loading, error }] = useClient('/users/whoami')

  if(loading) {
    return <p>Loading...</p>
  }

  if(error) {
    return <p>{error.message}</p>
  }

  return <div className="text-3xl">
    <p>Hola, {user.name}</p>
    <p>Tu perfil es: {user.profile === 'admin' ? 'Admin' : 'Usuario'}</p>
    <p>Tu correo es: {user.email}</p>
  </div>

}