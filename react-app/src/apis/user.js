import { axiosInstance } from '../utils/axios';

export const getById = (id) => axiosInstance().get(`/user/getbyid/${id}`);