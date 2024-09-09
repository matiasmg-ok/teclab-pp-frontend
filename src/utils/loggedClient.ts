import axios from "axios";
import useToken from "../hooks/useToken";
import { makeUseAxios } from "axios-hooks";

const token = useToken();

export const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer ${token}`
  }
})

export const useClient = makeUseAxios({
  axios: client
})