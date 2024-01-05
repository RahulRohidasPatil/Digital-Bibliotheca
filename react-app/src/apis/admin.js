import { axiosInstance } from '../utils/axios';

export const getUsers = () => axiosInstance().get('/admin/users');

export const banUser = (id) => axiosInstance().post(`/admin/banuser/${id}`);

export const unbanUser = (id) => axiosInstance().post(`/admin/unbanuser/${id}`);