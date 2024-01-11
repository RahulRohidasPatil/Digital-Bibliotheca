import { axiosInstance } from '../utils/axios';

export const getUnapprovedMedia = () => axiosInstance().get(`/admin/unapproved-media`);
export const verifyMedia = (id,value) => axiosInstance().put(`/admin/verify-media`,{
    Id:id,
    IsApproved:value
});

export const getUsers = () => axiosInstance().get('/admin/users');

export const banUser = (id) => axiosInstance().post(`/admin/banuser/${id}`);

export const unbanUser = (id) => axiosInstance().post(`/admin/unbanuser/${id}`);
