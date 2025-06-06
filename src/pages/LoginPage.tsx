import { MdEmail, MdPassword } from "react-icons/md";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useClient } from "../utils/loggedClient";

export default function LoginPage() {

  const [{ data: user }] = useClient('/users/whoami');

  if (user) {
    window.location.href = '/dashboard';
  }

  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  })

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userInfo.email,
        password: userInfo.password
      })
    });

    if (res.status === 200) {
      const data = await res.json();
      localStorage.setItem('token', JSON.stringify(data));

      if (localStorage.getItem('login-redirect')) {
        const data = JSON.parse(localStorage.getItem('login-redirect') || '');
        const now = new Date();

        if (now.getTime() - new Date(data.date).getTime() < 1000 * 60 * 5) {
          localStorage.removeItem('login-redirect');
          return window.location.href = data.url;
        }
      }

      return window.location.href = '/dashboard';
    } else {
      alert('Error al iniciar sesión');
    }
  }

  return <>
    <Navbar />
    <main className={'w-screen font-roboto flex justify-center items-center'}>
      <div className={'w-[28rem] h-[30rem] md:mb-32 bg-blue-50 dark:bg-slate-800 dark:text-white rounded-lg border-2 border-blue-500 flex flex-col items-center py-10'}>
        <img src="white_horizontal_logo.png" className="hidden dark:inline w-[10rem]" alt="Logo de SportsXLife" />
        <img src="horizontal_logo.png" className="dark:hidden w-[10rem]" alt="Logo de SportsXLife" />
        <h1 className="text-2xl font-medium mt-4">Iniciar Sesión</h1>
        <form onSubmit={login} className={'flex flex-col items-center gap-2 mt-4'}>
          <Input props={{
            placeholder: 'Email',
            style: {
              'width': '20rem'
            },
            value: userInfo.email,
            onChange: (e) => {
              setUserInfo({
                ...userInfo,
                email: e.target.value
              })
            }
          }} Icon={MdEmail} />
          <Input props={{
            placeholder: 'Contraseña',
            type: 'password',
            style: {
              'width': '20rem'
            },
            value: userInfo.password,
            onChange: (e) => {
              setUserInfo({
                ...userInfo,
                password: e.target.value
              })
            }
          }} Icon={MdPassword} />
          <button className="py-2 px-5 bg-blue-400 rounded-sm text-white mt-5 font-medium text-lg hover:bg-blue-500 transition-all">Iniciar Sesión</button>
        </form>
        <Link to={"/signup"}>
          <button className="text-sm mt-2 underline underline-offset-2">o Registrarse</button>
        </Link>
      </div>
    </main>
    <Footer />
  </>
}