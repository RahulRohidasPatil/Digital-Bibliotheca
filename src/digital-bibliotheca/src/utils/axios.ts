import axios from "axios";
import { getCookie } from "cookies-next";

export const axiosInstance = () => {
  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 1000,
    headers: {
      Accept: "application/json",
      "x-access-token": getCookie("token"),
      "ngrok-skip-browser-warning": "any"
    },
  });
  return axiosClient;
};
