import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortOption
  });

export const getAllMedia = (sortOption) => axiosInstance().get(`/media?sortOption=${sortOption}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);