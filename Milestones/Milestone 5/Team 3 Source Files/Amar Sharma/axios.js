import axios from 'axios';
import { getCookie, hasCookie, deleteCookie } from 'cookies-next';

function errorHandler(error) {
  if (error === null) throw new Error('Unrecoverable error!! Error is null!');
  if (axios.isAxiosError(error)) {
    // here we have a type guard check, error inside this if will be treated as AxiosError

    const response = error?.response;
    // const request = error?.request;
    const config = error?.config;
    if (config.raw) {
      return Promise.reject(error);
    }

    // here we have access the config used to make the api call (we can make a retry using this conf)

    if (error.code === 'ERR_NETWORK') {
      console.log('Connection Problems..');
    } else if (error.code === 'ERR_CANCELED') {
      console.log('Connection Canceled..');
    }
    if (response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
      const statusCode = response?.status;
      if (statusCode === 404) {
        console.log('The requested resource does not exist or has been deleted');
      } else if (statusCode === 403) {
        console.log('Please login to access this resource');
        localStorage.clear();
        if (hasCookie('token')) {
          deleteCookie('token');
        }
        window.location.replace('/login');
        // redirect user to login
      }
    }
  }
  // Something happened in setting up the request and triggered an Error
  return Promise.reject(error);
}

export const axiosInstance = () => {
  const baseURL =
    import.meta.env.VITE_ENVIRONMENT === 'production'
      ? import.meta.env.VITE_PRODUCTION_API_URL
      : import.meta.env.VITE_LOCAL_API_URL;

  let user = localStorage.getItem('user');

  if (user && JSON.parse(user)) {
    user = JSON.parse(user);
    user = user.Id;
  }
  const axiosClient = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      Authorization: hasCookie('token') ? getCookie('token') : null,
      'ngrok-skip-browser-warning': 'any',
      userId: user,
    },
  });

  axiosClient.interceptors.response.use({}, errorHandler);

  return axiosClient;
};
