export default function useToken(){
  const token = localStorage.getItem('token');

  if(!token) {
    return null;
  }

  return JSON.parse(token).token;
}