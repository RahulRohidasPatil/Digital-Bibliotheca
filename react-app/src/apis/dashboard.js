import { axiosInstance } from '../utils/axios';

export const getMediaByType = (mediaType) =>
  axiosInstance().get(`/dashboard/getLatestMediaByType/${mediaType}`);
