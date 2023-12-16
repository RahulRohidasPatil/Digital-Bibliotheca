import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm, sortOption }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm, sortOption
  });

export const getAllMedia = (sortOption, filters) => axiosInstance().get(`/media?sortOption=${sortOption}&filters=${filters}`);

export const getByID = (id) => axiosInstance().get(`/media/${id}`);