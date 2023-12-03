import axios from 'axios';
import { getCookie } from 'cookies-next';

export const axiosInstance = () => {
  const baseURL =
    import.meta.env.VITE_ENVIRONMENT === 'production'
      ? import.meta.env.VITE_PRODUCTION_API_URL
      : import.meta.env.VITE_LOCAL_API_URL;
  console.log(import.meta.env);
  const axiosClient = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'x-access-token': getCookie('token'),
      'ngrok-skip-browser-warning': 'any',
    },
  });
  return axiosClient;
};
