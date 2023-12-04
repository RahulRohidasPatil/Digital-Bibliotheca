import { axiosInstance } from '../utils/axios';

export const registerUser = ({ firstName, lastName, age, emailAddress, password, phone, role }) =>
  axiosInstance().post(`/auth/register`, {
    firstName,
    lastName,
    age,
    emailAddress,
    password,
    phone,
    role,
  });

export const loginUser = ({ emailAddress, password }) =>
  axiosInstance().post(`/auth/login`, {
    emailAddress,
    password,
  });
