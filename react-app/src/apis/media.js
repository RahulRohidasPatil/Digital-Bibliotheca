import { axiosInstance } from '../utils/axios';

export const searchMedia = ({ searchTerm }) =>
  axiosInstance().post(`/media/search`, {
    searchTerm,
  });

export const getAllMedia = () => axiosInstance().get(`/media`);

export const getMedia = (id) => axiosInstance().get(`/media/${id}`);