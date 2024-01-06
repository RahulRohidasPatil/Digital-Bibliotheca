import { axiosInstance } from '../utils/axios';

export const getUnapprovedMedia = () => axiosInstance().get(`/admin/unapproved-media`);
export const verifyMedia = (id,value) => axiosInstance().put(`/admin/verify-media`,{
    Id:id,
    IsApproved:value
});


