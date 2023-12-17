import { axiosInstance } from '../utils/axios';

export const getMediaPurchases = (userId) => axiosInstance().get(`/purchase/getmediapurchases/${userId}`);

export const purchaseMedia = (data) => axiosInstance().post('/purchase', data);