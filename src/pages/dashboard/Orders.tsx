import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useClient } from "../../utils/loggedClient";

export default function Orders() {

  const [{ data: user }] = useClient('/users/whoami');
  const [{ data: orders }] = useClient('/orders/self');

  return user && orders && <>
    <Navbar />
    <div className="font-roboto">
      <h1 className="text-2xl font-semibold text-center">Mis compras</h1>
      {
        orders.map((order) => {
          
        })
      }
    </div>
    <Footer />
  </>
}