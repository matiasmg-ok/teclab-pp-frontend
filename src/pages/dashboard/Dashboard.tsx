import { Link, useNavigate } from "react-router-dom";
import { useClient } from "../../utils/loggedClient";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MdInfo, MdLocalShipping } from "react-icons/md";

export default function Dashboard() {

  const navigate = useNavigate()

  const [{ data: user, loading, error }] = useClient('/users/whoami')

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  if (user?.profile === 'admin') {
    navigate('/admin')
  }

  return <>
    <Navbar />
    <div className="font-roboto text-black dark:text-white">
      <h1 className="text-2xl font-semibold text-center">Panel de cliente</h1>
      <div className="mx-auto flex items-center justify-center gap-4 mt-4">
        <Link className={'flex items-center gap-2 py-2 px-2 border-2 border-blue-200'} to="/dashboard/orders">
          <MdLocalShipping size={24} /> Mis compras
        </Link>
        <Link className={'flex items-center gap-2 py-2 px-2 border-2 border-blue-200'} to="/dashboard/orders">
          <MdInfo size={24} /> Mi información
        </Link>
      </div>
    </div>
    <Footer />
  </>

}