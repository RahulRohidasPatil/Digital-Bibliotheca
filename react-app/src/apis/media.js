import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm,
  });

export const getAllMedia = (sortOption) => axiosInstance().get(`/media?sortOption=${sortOption}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);