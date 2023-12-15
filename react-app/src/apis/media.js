import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortBy }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortBy
  });

export const getAllMedia = () => axiosInstance().get(`/media`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);