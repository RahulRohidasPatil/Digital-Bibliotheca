import { axiosInstance } from '../utils/axios';

export const getUserChats = (userId) => axiosInstance().get(`/chat/getuserchats/${userId}`);

