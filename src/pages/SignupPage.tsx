import { MdEmail, MdPassword, MdPerson } from "react-icons/md";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useClient } from "../utils/loggedClient";

export default function SignupPage() {

  const [{ data: user }] = useClient('/users/whoami');

  if (user) {
    window.location.href = '/dashboard';
  }

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  })

  async function signUp(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (userInfo.password !== userInfo.repeatPassword) {
      return alert('Las contraseñas no coinciden');
    }

    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password
      })
    })

    if (res.status === 201) {
      const data = await res.json();
      localStorage.setItem('token', JSON.stringify(data));

      return window.location.href = '/dashboard';
    } else {
      alert('Error al crear el usuario');
    }
  }

  return <>
    <Navbar />
    <main className={'w-screen font-roboto flex justify-center items-center'}>
      <div className={'w-[28rem] h-[35rem] md:mb-24 bg-blue-50 rounded-lg border-2 border-blue-500 flex flex-col items-center py-10'}>
        <img src="horizontal_logo.png" alt="Logo de SportsXLife" />
        <h1 className="text-2xl font-medium mt-4">Registrarse</h1>
        <form onSubmit={signUp} className={'flex flex-col items-center gap-2 mt-4'}>
          <Input props={{
            placeholder: 'Nombre completo',
            style: {
              'width': '20rem'
            },
            value: userInfo.name,
            onChange: (e) => {
              setUserInfo(prev => ({ ...prev, name: e.target.value }))
            }
          }} Icon={MdPerson} />
          <Input props={{
            type: 'email',
            placeholder: 'Email',
            style: {
              'width': '20rem'
            },
            value: userInfo.email,
            onChange: (e) => {
              setUserInfo(prev => ({ ...prev, email: e.target.value }))
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
              setUserInfo(prev => ({ ...prev, password: e.target.value }))
            }
          }} Icon={MdPassword} />
          <Input props={{
            placeholder: 'Confirmar contraseña',
            type: 'password',
            style: {
              'width': '20rem'
            },
            value: userInfo.repeatPassword,
            onChange: (e) => {
              setUserInfo(prev => ({ ...prev, repeatPassword: e.target.value }))
            }
          }} Icon={MdPassword} />
          <button className="py-2 px-5 bg-blue-400 rounded-sm text-white mt-5 font-medium text-lg hover:bg-blue-500 transition-all">Registrarse</button>
        </form>
        <Link to="/login">
          <button className="text-sm mt-2 underline underline-offset-2">o Iniciar Sesión</button>
        </Link>
      </div>
    </main>
    <Footer />
  </>
}