import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortOption
  });

export const getAllMedia = () => axiosInstance().get(`/media`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);