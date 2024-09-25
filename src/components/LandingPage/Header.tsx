import { useEffect, useState } from "react"
import { useUnloggedClient } from "../../utils/unloggedClient"
import { Link } from "react-router-dom"

export default function Header() {

  const [{ data: advertisements }] = useUnloggedClient('/advertisements')
  const [currentAdvertisementIndex, setCurrentAdvertisementIndex] = useState(0)

  useEffect(() => {
    setInterval(() => {
      if (!advertisements || advertisements.length === 0) return

      if (currentAdvertisementIndex >= advertisements.length - 1) {
        return setCurrentAdvertisementIndex(0)
      }

      return setCurrentAdvertisementIndex(prev => prev + 1)
    }, 5000)
  })

  return advertisements?.length ? <>
    <header>
      <Link to={`${advertisements[currentAdvertisementIndex].redirectUrl}`}>
        <img src={advertisements && `${import.meta.env.VITE_BACKEND_URL}/${advertisements[currentAdvertisementIndex]?.imageUrl}` || ''} className={'w-full mx-auto max-w-[1280px] h-[25rem] flex items-center justify-center object-contain'}>
        </img>
      </Link>
    </header>
  </> : <></>
}