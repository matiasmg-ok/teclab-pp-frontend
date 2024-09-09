import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(false);
  const fetchData = async () => {
    const token = JSON.parse(window.localStorage.getItem('token') || '');
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/users/whoami", {
      headers: {
        Authorization: `Bearer ${token?.token}`
      },
      method: 'GET'
    });

    if (!res.ok) {
      return window.location.href = '/';
    } else {
      setAuth(true);
    }
  };

  useEffect(() => {
    fetchData();
  })

  return <>{auth && children}</>;
};